const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Seed admin user (Temporary utility endpoint) 
// @route   POST /api/auth/seed
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@chocodelight.com' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already seeded' });
    }

    const adminUser = await User.create({
      email: 'admin@chocodelight.com',
      password: 'password123',
      role: 'admin'
    });

    res.status(201).json({ message: 'Admin seeded successfully. Email: admin@chocodelight.com, Password: password123' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
