const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  updateReservationStatus
} = require('../controllers/reservationController');

const router = express.Router();

// Public route
router.post('/', createReservation);

// Protected user routes
router.get('/my', authMiddleware, getMyReservations);
router.put('/:id/cancel', authMiddleware, cancelReservation);

// Admin routes
router.get('/admin', authMiddleware, roleMiddleware(['admin', 'manager']), getAllReservations);
router.put('/admin/:id/status', authMiddleware, roleMiddleware(['admin', 'manager']), updateReservationStatus);

module.exports = router;