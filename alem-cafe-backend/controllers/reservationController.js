const Reservation = require('../models/Reservation');
const { sendEmail } = require('../utils/emailService');

exports.createReservation = async (req, res) => {
  const { name, email, phone, date, time, guests, specialRequests } = req.body;
  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const id = await Reservation.create({ name, email, phone, date, time, guests, specialRequests });

    // Send confirmation to customer
    await sendEmail({
      to: email,
      subject: 'Reservation Confirmed | Alem Cafe',
      html: `<h2>Reservation Confirmed!</h2>
             <p>Dear ${name}, your table has been reserved.</p>
             <p><strong>Date:</strong> ${date}<br>
             <strong>Time:</strong> ${time}<br>
             <strong>Guests:</strong> ${guests}</p>
             <p>We look forward to serving you!</p>`
    });

    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Reservation Received',
      html: `<h2>New table reservation</h2>
             <p>${name} (${email}) reserved for ${guests} guests on ${date} at ${time}.</p>`
    });

    res.status(201).json({ message: 'Reservation created', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};