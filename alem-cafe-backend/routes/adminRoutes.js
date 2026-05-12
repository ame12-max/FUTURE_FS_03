const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { 
  getAllOrders, 
  updateOrderStatus, 
  getAnalytics,
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication AND role = admin or manager
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'manager']));

// Order routes
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/analytics', getAnalytics);

// Menu management routes
router.get('/menu', getAllMenuItems);
router.post('/menu', addMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

module.exports = router;