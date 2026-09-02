import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Temporary memory store for fallback when MongoDB is not connected
const memoryUsers = [];

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
    }

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: role === 'admin' ? 'admin' : 'customer'
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      // In-memory fallback
      const existing = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: `user_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        addresses: []
      };
      memoryUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        token: generateToken(newUser._id)
      });
    }
  } catch (error) {
    console.error('[AuthRoute] Register error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id)
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const user = memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id)
        });
      }
      // Demo admin shortcut login fallback
      if (email === 'admin@goldmart.com' && password === 'admin123') {
        const adminUser = {
          _id: 'admin_demo_1',
          name: 'Goldmart Admin',
          email: 'admin@goldmart.com',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
        };
        return res.json({
          ...adminUser,
          token: generateToken(adminUser._id)
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[AuthRoute] Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// @desc    Google OAuth authenticate
// @route   POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { googleToken, name, email, avatar } = req.body;

    const userEmail = email ? email.toLowerCase() : `user_${Date.now()}@google.com`;
    const userName = name || 'Google User';
    const userAvatar = avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';

    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne({ email: userEmail });
      if (!user) {
        user = await User.create({
          name: userName,
          email: userEmail,
          googleId: googleToken || `google_${Date.now()}`,
          avatar: userAvatar,
          role: 'customer'
        });
      }
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      let user = memoryUsers.find((u) => u.email === userEmail);
      if (!user) {
        user = {
          _id: `user_g_${Date.now()}`,
          name: userName,
          email: userEmail,
          role: 'customer',
          avatar: userAvatar
        };
        memoryUsers.push(user);
      }
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error('[AuthRoute] Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed', error: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) return res.json(user);
    }
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

export default router;
