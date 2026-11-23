import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getCollection, saveStore, isMongo } from '../config/db.js';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'postpilot_jwt_super_secret_p59_maruthi_dapke_2026';

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role = 'manager', timezone = 'Asia/Kolkata' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (isMongo()) {
      const User = mongoose.model('User');
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
      }
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
        timezone
      });
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        message: 'Registration successful.',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, timezone: user.timezone }
      });
    } else {
      const users = getCollection('users');
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
      }
      const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newUser = {
        _id: newId,
        id: newId,
        name,
        email: email.toLowerCase(),
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
        message: 'Registration successful.',
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
      user = await User.findOne({ email: email.toLowerCase() });
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
      message: 'Login successful.',
      token,
      user: { id: userId, name: user.name, email: user.email, role: user.role, timezone: user.timezone }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    let user;
    if (isMongo()) {
      const User = mongoose.model('User');
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      const users = getCollection('users');
      user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      // Security best practice: don't reveal email existence explicitly, but provide helpful feedback
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, password reset instructions and token have been issued.',
        resetToken: 'P59-DEMO-RESET-TOKEN'
      });
    }

    const resetToken = crypto.randomBytes(16).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    if (!isMongo()) {
      saveStore();
    } else {
      await user.save();
    }

    return res.json({
      success: true,
      message: 'Password reset token generated successfully.',
      resetToken,
      note: 'In this environment, you can use the token directly on the Reset Password page.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    let user;
    if (isMongo()) {
      const User = mongoose.model('User');
      user = await User.findOne({
        $or: [
          { resetToken: token },
          { email: email ? email.toLowerCase() : '' }
        ]
      });
    } else {
      const users = getCollection('users');
      user = users.find(u => (token && u.resetToken === token) || (email && u.email.toLowerCase() === email.toLowerCase()));
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    if (!isMongo()) {
      saveStore();
    } else {
      await user.save();
    }

    return res.json({
      success: true,
      message: 'Password has been successfully reset. You may now log in with your new password.'
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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { name, timezone, role } = req.body;

    if (isMongo()) {
      const User = mongoose.model('User');
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (name) user.name = name;
      if (timezone) user.timezone = timezone;
      if (role) user.role = role;
      await user.save();
      return res.json({ success: true, message: 'Profile updated successfully', user });
    } else {
      const users = getCollection('users');
      const user = users.find(u => u._id === userId || u.id === userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (name) user.name = name;
      if (timezone) user.timezone = timezone;
      if (role) user.role = role;
      saveStore();
      const { passwordHash, ...safeUser } = user;
      return res.json({ success: true, message: 'Profile updated successfully', user: safeUser });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
