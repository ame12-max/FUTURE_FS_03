// models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query(
      'SELECT id, name, email, password, role, preferred_currency, preferred_language, created_at FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },
  
  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT id, name, email, role, preferred_currency, preferred_language, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },
  
  create: async (name, email, password, role = 'user') => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  },
  
  updateProfile: async (id, { name, email, phone, preferred_currency, preferred_language }) => {
    const updates = [];
    const params = [];
    
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email); }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
    if (preferred_currency !== undefined) { updates.push('preferred_currency = ?'); params.push(preferred_currency); }
    if (preferred_language !== undefined) { updates.push('preferred_language = ?'); params.push(preferred_language); }
    
    if (updates.length === 0) return 0;
    
    params.push(id);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await db.query(query, params);
    return result.affectedRows;
  }
};

module.exports = User;