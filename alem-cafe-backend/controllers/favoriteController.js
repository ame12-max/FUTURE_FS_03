const db = require('../config/db');

// Get user's favorites
exports.getFavorites = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.* FROM menu_items m 
       JOIN user_favorites f ON m.id = f.menu_item_id 
       WHERE f.user_id = ? 
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add to favorites
exports.addFavorite = async (req, res) => {
  const { menuItemId } = req.body;
  try {
    await db.query(
      'INSERT INTO user_favorites (user_id, menu_item_id) VALUES (?, ?)',
      [req.user.id, menuItemId]
    );
    res.status(201).json({ message: 'Added to favorites' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Already in favorites' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Remove from favorites
exports.removeFavorite = async (req, res) => {
  const { menuItemId } = req.params;
  try {
    await db.query(
      'DELETE FROM user_favorites WHERE user_id = ? AND menu_item_id = ?',
      [req.user.id, menuItemId]
    );
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};