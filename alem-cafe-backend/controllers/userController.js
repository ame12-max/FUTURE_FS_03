const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const db = require('../config/db');


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
      'SELECT id, name, email, phone, preferred_currency, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { name, email, phone, preferred_currency } = req.body;
  try {
    await db.query(
      'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), preferred_currency = COALESCE(?, preferred_currency) WHERE id = ?',
      [name, email, phone, preferred_currency, req.user.id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const bcrypt = require('bcryptjs');
  
  try {
    const [rows] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];
    
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};