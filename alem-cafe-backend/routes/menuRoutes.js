const express = require('express');
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', menuController.getMenu);
router.get('/:id', menuController.getMenuItem);
router.get('/:id/reviews', menuController.getReviews);

// Protected route (requires authentication)
router.post('/:id/reviews', authMiddleware, menuController.addReview);

module.exports = router;