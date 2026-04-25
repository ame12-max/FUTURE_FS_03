const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/emailService');

exports.submitContact = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }
  try {
    await Contact.create({ name, email, phone, subject, message });

    // Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact: ${subject || 'No subject'}`,
      html: `<h2>New contact message</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
             <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
             <p><strong>Message:</strong> ${message}</p>`
    });

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};