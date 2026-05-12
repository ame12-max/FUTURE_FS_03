const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    await Order.updateStatus(req.params.id, status);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await Order.getAnalytics();
    const menuItems = await MenuItem.findAll(false);
    const lowStock = menuItems.filter(m => m.is_available === false);
    res.json({ ...analytics, lowStockCount: lowStock.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new menu item
exports.addMenuItem = async (req, res) => {
  const { name, description, full_description, price, category, calories, preparation_time, ingredients, allergens, dietary_tags, nutritional_info, is_available } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  try {
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Convert is_available to integer (1 or 0)
    const available = is_available === true || is_available === 'true' || is_available === 1 || is_available === '1' ? 1 : 0;
    
    const [result] = await db.query(
      `INSERT INTO menu_items 
       (name, description, full_description, price, category, image_url, calories, preparation_time, ingredients, allergens, dietary_tags, nutritional_info, is_available) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        description || null, 
        full_description || null, 
        price, 
        category || null, 
        image_url, 
        calories || null, 
        preparation_time || null, 
        ingredients || null, 
        allergens || null, 
        dietary_tags || null, 
        nutritional_info || null, 
        available
      ]
    );
    res.status(201).json({ message: 'Menu item added', id: result.insertId });
  } catch (err) {
    console.error('Add menu item error:', err);
    res.status(500).json({ error: err.message });
  }
};
// Update menu item
// controllers/adminController.js

// Update menu item (supports partial updates)
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { 
    name, description, full_description, price, category, 
    calories, preparation_time, ingredients, allergens, 
    dietary_tags, nutritional_info, is_available 
  } = req.body;
  
  try {
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    
    // Build dynamic query for partial updates
    const updates = [];
    const params = [];
    
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (full_description !== undefined) { updates.push('full_description = ?'); params.push(full_description); }
    if (price !== undefined) { updates.push('price = ?'); params.push(price); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (calories !== undefined) { updates.push('calories = ?'); params.push(calories); }
    if (preparation_time !== undefined) { updates.push('preparation_time = ?'); params.push(preparation_time); }
    if (ingredients !== undefined) { updates.push('ingredients = ?'); params.push(ingredients); }
    if (allergens !== undefined) { updates.push('allergens = ?'); params.push(allergens); }
    if (dietary_tags !== undefined) { updates.push('dietary_tags = ?'); params.push(dietary_tags); }
    if (nutritional_info !== undefined) { updates.push('nutritional_info = ?'); params.push(nutritional_info); }
    
    // Convert is_available to integer (1 or 0)
    if (is_available !== undefined) {
      const availableInt = is_available === true || is_available === 'true' || is_available === 1 || is_available === '1' ? 1 : 0;
      updates.push('is_available = ?');
      params.push(availableInt);
    }
    
    if (image_url) { updates.push('image_url = ?'); params.push(image_url); }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    params.push(id);
    const query = `UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`;
    
    console.log('Update query:', query);
    console.log('Params:', params);
    
    await db.query(query, params);
    res.json({ message: 'Menu item updated' });
  } catch (err) {
    console.error('Update menu item error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.delete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add these methods to your existing adminController.js

// Get all menu items (for admin)
// Add this at the top of adminController.js
const db = require('../config/db');

// Get all menu items (for admin)
exports.getAllMenuItems = async (req, res) => {
  try {
    console.log('Fetching all menu items...');
    const [rows] = await db.query('SELECT * FROM menu_items ORDER BY display_order ASC, id ASC');
    console.log('Menu items found:', rows.length);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add new menu item
exports.addMenuItem = async (req, res) => {
  const { name, description, full_description, price, category, calories, preparation_time, ingredients, allergens, dietary_tags, nutritional_info, is_available } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  try {
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await db.query(
      `INSERT INTO menu_items 
       (name, description, full_description, price, category, image_url, calories, preparation_time, ingredients, allergens, dietary_tags, nutritional_info, is_available) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description || null, full_description || null, price, category || null, image_url, calories || null, preparation_time || null, ingredients || null, allergens || null, dietary_tags || null, nutritional_info || null, is_available !== undefined ? is_available : true]
    );
    res.status(201).json({ message: 'Menu item added', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, full_description, price, category, calories, preparation_time, ingredients, allergens, dietary_tags, nutritional_info, is_available } = req.body;
  
  try {
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    
    let query = `UPDATE menu_items SET 
      name=COALESCE(?, name),
      description=COALESCE(?, description),
      full_description=COALESCE(?, full_description),
      price=COALESCE(?, price),
      category=COALESCE(?, category),
      calories=COALESCE(?, calories),
      preparation_time=COALESCE(?, preparation_time),
      ingredients=COALESCE(?, ingredients),
      allergens=COALESCE(?, allergens),
      dietary_tags=COALESCE(?, dietary_tags),
      nutritional_info=COALESCE(?, nutritional_info),
      is_available=COALESCE(?, is_available)`;
    
    const params = [name, description, full_description, price, category, calories, preparation_time, ingredients, allergens, dietary_tags, nutritional_info, is_available];
    
    if (image_url) {
      query += `, image_url = COALESCE(?, image_url)`;
      params.push(image_url);
    }
    
    query += ` WHERE id = ?`;
    params.push(id);
    
    await db.query(query, params);
    res.json({ message: 'Menu item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM menu_items WHERE id = ?', [id]);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};