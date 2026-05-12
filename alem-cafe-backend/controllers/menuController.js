const MenuItem = require('../models/MenuItem');

exports.getMenu = async (req, res) => {
  try {
    const items = await MenuItem.findAll(true);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    // Get reviews and calculate average rating
    const reviews = await MenuItem.getReviews(req.params.id);
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;
    
    res.json({ ...item, reviews, averageRating });
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add to existing menuController.js

exports.getReviews = async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await MenuItem.getReviews(id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  
  console.log('addReview called for menu item:', id);
  console.log('req.user:', req.user);
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  
  try {
    const userId = req.user?.id || null;
    const userName = req.user?.name || 'Guest User';
    
    console.log('Saving review with userId:', userId, 'userName:', userName);
    
    const reviewId = await MenuItem.addReview(id, userId, userName, rating, comment);
    res.status(201).json({ message: 'Review added', reviewId });
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ error: err.message });
  }
};