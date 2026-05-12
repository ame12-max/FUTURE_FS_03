const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const MenuItem = require('../models/MenuItem');
const { sendEmail } = require('../utils/emailService');

exports.createOrder = async (req, res) => {
  const { customerName, customerEmail, customerPhone, deliveryAddress, orderType, items, paymentMethod, specialInstructions } = req.body;
  
  if (!customerName || !customerEmail || !items || !items.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    let totalAmount = 0;
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.id);
      if (!menuItem) return res.status(404).json({ error: `Item ${item.id} not found` });
      item.unitPrice = menuItem.price;
      item.subtotal = item.quantity * menuItem.price;
      totalAmount += item.subtotal;
    }
    
    const orderId = await Order.create({
      customerName, customerEmail, customerPhone, deliveryAddress, orderType,
      totalAmount, paymentMethod, specialInstructions
    });
    
    for (let item of items) {
      await OrderItem.create({
        orderId, menuItemId: item.id, quantity: item.quantity,
        unitPrice: item.unitPrice, subtotal: item.subtotal
      });
    }
    
    await sendEmail({
      to: customerEmail,
      subject: `Order Confirmation #${orderId}`,
      html: `<h2>Thank you for your order!</h2>
             <p>Order #${orderId} has been received. Total: $${totalAmount}</p>
             <p>We'll notify you when your order is ready.</p>`
    });
    
    res.status(201).json({ message: 'Order placed', orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const items = await OrderItem.findByOrderId(order.id);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByEmail = async (req, res) => {
  try {
    const orders = await Order.findByEmail(req.query.email);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this method to orderController.js
exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if user owns this order (for non-admin)
    if (req.user && order.customer_email !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Only allow cancellation if status is 'pending'
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order cannot be cancelled. Current status: ' + order.status });
    }
    
    await Order.updateStatus(id, 'cancelled');
    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};