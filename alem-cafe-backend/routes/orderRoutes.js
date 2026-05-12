const express = require('express');
const { createOrder, getOrder, getOrdersByEmail, cancelOrder } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createOrder);
router.get('/:id', getOrder);
router.get('/search/by-email', getOrdersByEmail);
router.put('/:id/cancel', authMiddleware, cancelOrder);


module.exports = router;