const express = require('express');
const { createReservation } = require('../controllers/reservationController');
const router = express.Router();

router.post('/', createReservation);

module.exports = router;