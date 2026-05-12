const db = require('../config/db');

const MenuItem = {
  findAll: async (onlyAvailable = true) => {
    let query = 'SELECT * FROM menu_items';
    if (onlyAvailable) query += ' WHERE is_available = true';
    query += ' ORDER BY display_order ASC, id ASC';
    const [rows] = await db.query(query);
    return rows;
  },
  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0];
  },
  create: async ({ name, description, fullDescription, price, category, imageUrl, calories, ingredients, preparationTime, allergens, dietaryTags, nutritionalInfo }) => {
    const [result] = await db.query(
      `INSERT INTO menu_items 
       (name, description, full_description, price, category, image_url, calories, ingredients, preparation_time, allergens, dietary_tags, nutritional_info) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, fullDescription, price, category, imageUrl, calories, ingredients, preparationTime, allergens, dietaryTags, nutritionalInfo]
    );
    return result.insertId;
  },
  update: async (id, { name, description, fullDescription, price, category, imageUrl, calories, isAvailable, ingredients, preparationTime, allergens, dietaryTags, nutritionalInfo }) => {
    const [result] = await db.query(
      `UPDATE menu_items SET 
       name=?, description=?, full_description=?, price=?, category=?, 
       image_url=?, calories=?, is_available=?, ingredients=?, 
       preparation_time=?, allergens=?, dietary_tags=?, nutritional_info=? 
       WHERE id=?`,
      [name, description, fullDescription, price, category, imageUrl, calories, isAvailable, ingredients, preparationTime, allergens, dietaryTags, nutritionalInfo, id]
    );
    return result.affectedRows;
  },
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM menu_items WHERE id = ?', [id]);
    return result.affectedRows;
  },
  // Add to existing MenuItem model

getReviews: async (menuItemId) => {
  const [rows] = await db.query(
    `SELECT r.*, u.name as user_name 
     FROM menu_reviews r 
     LEFT JOIN users u ON r.user_id = u.id 
     WHERE r.menu_item_id = ? 
     ORDER BY r.created_at DESC`,
    [menuItemId]
  );
  return rows;
},

addReview: async (menuItemId, userId, userName, rating, comment) => {
  const [result] = await db.query(
    'INSERT INTO menu_reviews (menu_item_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
    [menuItemId, userId, userName, rating, comment]
  );
  return result.insertId;
},

getAverageRating: async (menuItemId) => {
  const [rows] = await db.query(
    'SELECT AVG(rating) as average, COUNT(*) as count FROM menu_reviews WHERE menu_item_id = ?',
    [menuItemId]
  );
  return { average: rows[0].average, count: rows[0].count };
}
};

module.exports = MenuItem;