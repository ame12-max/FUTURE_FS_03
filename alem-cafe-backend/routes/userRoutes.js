const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getMyOrders, getMyOrderDetails, getProfile, updateProfile, changePassword } = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);
router.get('/orders', getMyOrders);
router.get('/orders/:id', getMyOrderDetails);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);


module.exports = router;