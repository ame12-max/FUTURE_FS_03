const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
findById: async (id) => {
  const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
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
  updateRole: async (id, role) => {
    const [result] = await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    return result.affectedRows;
  }
};

module.exports = User;