const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

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