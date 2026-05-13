const db = require('../config/db');

const Reservation = {
  create: async ({ userId, name, email, phone, date, time, guests, specialRequests }) => {
    const [result] = await db.query(
      `INSERT INTO reservations 
       (user_id, name, email, phone, reservation_date, reservation_time, guests, special_requests) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId || null, name, email, phone, date, time, guests, specialRequests || null]
    );
    return result.insertId;
  },

  findByUser: async (userId) => {
    const [rows] = await db.query(
      'SELECT * FROM reservations WHERE user_id = ? ORDER BY reservation_date DESC, reservation_time DESC',
      [userId]
    );
    return rows;
  },

  findByEmail: async (email) => {
    const [rows] = await db.query(
      'SELECT * FROM reservations WHERE email = ? ORDER BY reservation_date DESC, reservation_time DESC',
      [email]
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM reservations WHERE id = ?', [id]);
    return rows[0];
  },

  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM reservations ORDER BY reservation_date DESC, reservation_time DESC');
    return rows;
  },

  updateStatus: async (id, status) => {
    const [result] = await db.query('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows;
  },

  cancel: async (id) => {
    const [result] = await db.query('UPDATE reservations SET status = "cancelled" WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Reservation;