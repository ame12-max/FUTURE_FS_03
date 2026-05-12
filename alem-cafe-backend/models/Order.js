const db = require('../config/db');

const Order = {
  create: async ({ customerName, customerEmail, customerPhone, deliveryAddress, orderType, totalAmount, paymentMethod, specialInstructions }) => {
    const [result] = await db.query(
      `INSERT INTO orders 
       (customer_name, customer_email, customer_phone, delivery_address, order_type, total_amount, payment_method, special_instructions, status, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [customerName, customerEmail, customerPhone, deliveryAddress, orderType, totalAmount, paymentMethod, specialInstructions]
    );
    return result.insertId;
  },
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  },
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC', [email]);
    return rows;
  },
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    return rows;
  },
  updateStatus: async (id, status) => {
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows;
  },
  updatePaymentStatus: async (id, paymentStatus) => {
    const [result] = await db.query('UPDATE orders SET payment_status = ? WHERE id = ?', [paymentStatus, id]);
    return result.affectedRows;
  },
  getAnalytics: async () => {
    const [total] = await db.query('SELECT COUNT(*) as total, SUM(total_amount) as revenue FROM orders WHERE payment_status = "paid" OR status != "cancelled"');
    const [byStatus] = await db.query('SELECT status, COUNT(*) as count FROM orders GROUP BY status');
    const [today] = await db.query('SELECT COUNT(*) as todayOrders, SUM(total_amount) as todayRevenue FROM orders WHERE DATE(created_at) = CURDATE()');
    return { total: total[0], byStatus, today: today[0] };
  }
};

module.exports = Order;