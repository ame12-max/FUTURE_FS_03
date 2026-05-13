const Reservation = require('../models/Reservation');
const { sendEmail } = require('../utils/emailService');

// Create a new reservation (public)
exports.createReservation = async (req, res) => {
  const { name, email, phone, date, time, guests, specialRequests } = req.body;
  
  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const userId = req.user?.id || null;
    const reservationId = await Reservation.create({
      userId, name, email, phone, date, time, guests, specialRequests
    });
    
    // Send confirmation email
    await sendEmail({
      to: email,
      subject: 'Reservation Confirmed - Alem Cafe',
      html: `
        <h2>Reservation Confirmed!</h2>
        <p>Dear ${name},</p>
        <p>Your table has been reserved at Alem Cafe.</p>
        <p><strong>Date:</strong> ${date}<br>
        <strong>Time:</strong> ${time}<br>
        <strong>Guests:</strong> ${guests}</p>
        <p>We look forward to serving you!</p>
      `
    });
    
    res.status(201).json({ 
      message: 'Reservation created successfully', 
      reservationId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get user's reservations (protected)
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findByUser(req.user.id);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel a reservation (protected)
exports.cancelReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    if (reservation.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await Reservation.cancel(id);
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.getAll();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Update reservation status
exports.updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    await Reservation.updateStatus(id, status);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};