import jwt from 'jsonwebtoken';
import { getCollection, isMongo } from '../config/db.js';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'postpilot_jwt_super_secret_p59_maruthi_dapke_2026';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (isMongo()) {
      const User = mongoose.model('User');
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found or session invalid.' });
      }
      req.user = user;
    } else {
      const users = getCollection('users');
      const user = users.find(u => u._id === decoded.id || u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found or session invalid.' });
      }
      const { passwordHash, ...safeUser } = user;
      req.user = safeUser;
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access denied. Requires one of roles: ${roles.join(', ')}` });
    }
    next();
  };
};
