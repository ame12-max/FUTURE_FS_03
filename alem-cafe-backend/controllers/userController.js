const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const db = require('../config/db');
const bcrypt = require('bcryptjs');


exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findByEmail(req.user.email);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.customer_email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const items = await OrderItem.findByOrderId(order.id);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, preferred_currency, preferred_language, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update user profile (including preferences)
exports.updateProfile = async (req, res) => {
  const { name, email, phone, preferred_currency, preferred_language } = req.body;
  
  try {
    const updates = [];
    const params = [];
    
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email); }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
    if (preferred_currency !== undefined) { updates.push('preferred_currency = ?'); params.push(preferred_currency); }
    if (preferred_language !== undefined) { updates.push('preferred_language = ?'); params.push(preferred_language); }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    params.push(req.user.id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    
    await db.query(query, params);
    
    // Get updated user data
    const [rows] = await db.query(
      'SELECT id, name, email, phone, preferred_currency, preferred_language FROM users WHERE id = ?',
      [req.user.id]
    );
    
    res.json({ message: 'Profile updated', user: rows[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  
  try {
    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isValid = await bcrypt.compare(currentPassword, rows[0].password);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: err.message });
  }
};