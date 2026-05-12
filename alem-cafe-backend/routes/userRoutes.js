const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getMyOrders, getMyOrderDetails } = require('../controllers/userController');
const router = express.Router();

router.use(authMiddleware);
router.get('/orders', getMyOrders);
router.get('/orders/:id', getMyOrderDetails);

module.exports = router;