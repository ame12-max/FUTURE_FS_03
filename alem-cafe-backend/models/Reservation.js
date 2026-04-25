const db = require('../config/db');

const Reservation = {
  create: async ({ name, email, phone, date, time, guests, specialRequests }) => {
    const [result] = await db.query(
      'INSERT INTO reservations (name, email, phone, reservation_date, reservation_time, guests, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, date, time, guests, specialRequests || null]
    );
    return result.insertId;
  }
};

module.exports = Reservation;