const db = require('../config/db');

const Cart = {
  // Get or create cart for user
  getOrCreateCart: async (userId) => {
    // Check if cart exists
    let [rows] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (rows.length > 0) {
      return rows[0].id;
    }
    // Create new cart
    const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
    return result.insertId;
  },

  // Get cart with items
  getCartWithItems: async (userId) => {
    const cartId = await Cart.getOrCreateCart(userId);
    const [items] = await db.query(`
      SELECT ci.id as cart_item_id, ci.quantity, mi.id, mi.name, mi.price, mi.image_url
      FROM cart_items ci
      JOIN menu_items mi ON ci.menu_item_id = mi.id
      WHERE ci.cart_id = ?
    `, [cartId]);
    return { cartId, items };
  },

  // Add item to cart
  addItem: async (userId, menuItemId, quantity = 1) => {
    const cartId = await Cart.getOrCreateCart(userId);
    // Check if item already exists in cart
    const [existing] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND menu_item_id = ?',
      [cartId, menuItemId]
    );
    if (existing.length > 0) {
      const newQuantity = existing[0].quantity + quantity;
      await db.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existing[0].id]
      );
      return { updated: true, quantity: newQuantity };
    } else {
      await db.query(
        'INSERT INTO cart_items (cart_id, menu_item_id, quantity) VALUES (?, ?, ?)',
        [cartId, menuItemId, quantity]
      );
      return { added: true, quantity };
    }
  },

  // Update cart item quantity
  updateQuantity: async (userId, menuItemId, quantity) => {
    const cartId = await Cart.getOrCreateCart(userId);
    if (quantity <= 0) {
      await db.query(
        'DELETE FROM cart_items WHERE cart_id = ? AND menu_item_id = ?',
        [cartId, menuItemId]
      );
      return { removed: true };
    }
    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND menu_item_id = ?',
      [quantity, cartId, menuItemId]
    );
    return { updated: true, quantity };
  },

  // Remove item from cart
  removeItem: async (userId, menuItemId) => {
    const cartId = await Cart.getOrCreateCart(userId);
    await db.query(
      'DELETE FROM cart_items WHERE cart_id = ? AND menu_item_id = ?',
      [cartId, menuItemId]
    );
    return { removed: true };
  },

  // Clear entire cart
  clearCart: async (userId) => {
    const cartId = await Cart.getOrCreateCart(userId);
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    return { cleared: true };
  }
};

module.exports = Cart;