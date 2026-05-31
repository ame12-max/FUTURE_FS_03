// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth client (ONLY with client ID, no secret needed)
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  
  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const userRole = role === 'admin' || role === 'manager' ? 'user' : (role || 'user');
    const userId = await User.create(name, email, password, userRole);
    const user = await User.findById(userId);
    const token = generateToken(user);
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferred_currency: user.preferred_currency || 'ETB',
        preferred_language: user.preferred_language || 'en'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferred_currency: user.preferred_currency || 'ETB',
        preferred_language: user.preferred_language || 'en'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user profile (protected)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferred_currency: user.preferred_currency || 'ETB',
      preferred_language: user.preferred_language || 'en',
      created_at: user.created_at,
      picture: user.picture || null,
    });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.googleLogin = async (req, res) => {
  const { credential } = req.body;
  
  if (!credential) {
    return res.status(400).json({ message: 'Credential token required' });
  }
  
  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;  // ✅ Get picture from Google
    
    console.log('Google user data:', { email, name, picture }); // Debug log
    
    // Check if user exists
    let user = await User.findByEmail(email);
    
    if (!user) {
      // Create new user with picture
      const userId = await User.create(
        name || email.split('@')[0],
        email,
        Math.random().toString(36).slice(-12),
        'user',
        picture  // ✅ Pass picture to create function
      );
      user = await User.findById(userId);
    } else {
      // Update existing user's picture if changed (optional)
      await User.updatePicture(user.id, picture);
    }
    
    const token = generateToken(user);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: picture || user.picture || null,  // ✅ Return picture
        preferred_currency: user.preferred_currency || 'ETB',
        preferred_language: user.preferred_language || 'en'
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
};