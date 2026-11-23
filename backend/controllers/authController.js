import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCollection, saveStore, isMongo } from '../config/db.js';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'postpilot_jwt_super_secret_p59_maruthi_dapke_2026';

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'manager', timezone = 'UTC' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (isMongo()) {
      const User = mongoose.model('User');
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
      }
      const user = await User.create({ name, email, passwordHash, role, timezone });
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, timezone: user.timezone }
      });
    } else {
      const users = getCollection('users');
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
      }
      const newUser = {
        _id: `usr_${Date.now()}`,
        id: `usr_${Date.now()}`,
        name,
        email,
        passwordHash,
        role,
        timezone,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      saveStore();
      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, timezone: newUser.timezone }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    let user;
    if (isMongo()) {
      const User = mongoose.model('User');
      user = await User.findOne({ email });
    } else {
      const users = getCollection('users');
      user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const userId = user._id || user.id;
    const token = jwt.sign({ id: userId, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: { id: userId, name: user.name, email: user.email, role: user.role, timezone: user.timezone }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};
