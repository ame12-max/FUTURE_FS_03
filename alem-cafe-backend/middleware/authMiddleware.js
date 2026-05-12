// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token received:', token ? 'Yes' : 'No');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Fetch fresh user data from DB
    const user = await User.findById(decoded.id);
    console.log('User from DB:', user);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user; // Should contain { id, name, email, role }
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};