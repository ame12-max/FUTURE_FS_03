const db = require('../config/db');

const OrderItem = {
  create: async ({ orderId, menuItemId, quantity, unitPrice, subtotal }) => {
    const [result] = await db.query(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
      [orderId, menuItemId, quantity, unitPrice, subtotal]
    );
    return result.insertId;
  },
  findByOrderId: async (orderId) => {
    const [rows] = await db.query(
      `SELECT oi.*, mi.name as item_name, mi.image_url 
       FROM order_items oi 
       JOIN menu_items mi ON oi.menu_item_id = mi.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  }
};

module.exports = OrderItem;