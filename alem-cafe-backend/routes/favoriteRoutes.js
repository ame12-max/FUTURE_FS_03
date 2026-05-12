const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');

const router = express.Router();
router.use(authMiddleware);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:menuItemId', removeFavorite);

module.exports = router;