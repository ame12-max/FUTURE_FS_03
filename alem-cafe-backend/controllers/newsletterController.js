const Newsletter = require('../models/Newsletter');
const { sendEmail } = require('../utils/emailService');

exports.subscribe = async (req, res) => {
  const { email } = req.body;
  console.log('Newsletter subscription request:', email);
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const result = await Newsletter.subscribe(email);
    console.log('Saved to DB, id:', result);
    // Optionally send email (disable if not needed for testing)
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Alem Cafe Coffee Club!',
        html: `<h2>Thank you for subscribing!</h2>
               <p>You'll receive exclusive offers and updates.</p>`
      });
    } catch (emailErr) {
      console.error('Email sending failed, but subscription saved:', emailErr.message);
    }
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Subscription error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};