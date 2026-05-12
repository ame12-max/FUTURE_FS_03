const Cart = require('../models/Cart');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const { items } = await Cart.getCartWithItems(req.user.id);
    // Calculate totals
    const cartItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image_url,
      quantity: item.quantity,
      subtotal: parseFloat(item.price) * item.quantity
    }));
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items: cartItems, total, itemCount: cartItems.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { menuItemId, quantity = 1 } = req.body;
  if (!menuItemId) {
    return res.status(400).json({ error: 'menuItemId is required' });
  }
  try {
    const result = await Cart.addItem(req.user.id, menuItemId, quantity);
    const { items } = await Cart.getCartWithItems(req.user.id);
    const cartItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image_url,
      quantity: item.quantity,
      subtotal: parseFloat(item.price) * item.quantity
    }));
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items: cartItems, total, itemCount: cartItems.length, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  const { menuItemId, quantity } = req.body;
  if (!menuItemId || quantity === undefined) {
    return res.status(400).json({ error: 'menuItemId and quantity are required' });
  }
  try {
    await Cart.updateQuantity(req.user.id, menuItemId, quantity);
    const { items } = await Cart.getCartWithItems(req.user.id);
    const cartItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image_url,
      quantity: item.quantity,
      subtotal: parseFloat(item.price) * item.quantity
    }));
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items: cartItems, total, itemCount: cartItems.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { menuItemId } = req.params;
  try {
    await Cart.removeItem(req.user.id, menuItemId);
    const { items } = await Cart.getCartWithItems(req.user.id);
    const cartItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image_url,
      quantity: item.quantity,
      subtotal: parseFloat(item.price) * item.quantity
    }));
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items: cartItems, total, itemCount: cartItems.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.clearCart(req.user.id);
    res.json({ items: [], total: 0, itemCount: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Sync local cart to db after login
exports.syncCart = async (req, res) => {
  const { localCart } = req.body;
  if (!localCart || !localCart.length) {
    return res.json({ message: 'No items to sync' });
  }
  try {
    for (const item of localCart) {
      await Cart.addItem(req.user.id, item.id, item.quantity);
    }
    const { items } = await Cart.getCartWithItems(req.user.id);
    const cartItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image_url,
      quantity: item.quantity,
      subtotal: parseFloat(item.price) * item.quantity
    }));
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items: cartItems, total, itemCount: cartItems.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};