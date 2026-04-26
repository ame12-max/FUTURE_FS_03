// src/components/Contact.jsx
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      await axios.post(`${apiBaseUrl}/api/contact`, formData);
      setSubmitStatus({ type: 'success', message: 'Message sent successfully! ✨' });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 4000);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send message. Please try again.'
      });
      setTimeout(() => setSubmitStatus(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // All your existing JSX (design) remains exactly the same – only the form tag gets onSubmit and the button gets disabled state.
  // I'll keep your original markup; just ensure the form has onSubmit and the button shows loading text.
  // Since you didn't provide the exact Contact.jsx markup, I'll assume it looks like the one we used earlier (with glass card, etc.).
  // Below is a representative preservation of your design – please copy your actual JSX into this component and just replace the logic parts.

  return (
    <section id="contact" ref={ref} className="py-20 bg-black/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-gold mb-3">Get in Touch</h2>
            <p className="text-gray-300">We'd love to hear from you</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gold/30 focus:outline-none text-white placeholder-gray-400" required />
                </div>
                <div>
                  <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gold/30 focus:outline-none text-white placeholder-gray-400" required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input type="tel" name="phone" placeholder="Phone (optional)" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gold/30 focus:outline-none text-white placeholder-gray-400" />
                </div>
                <div>
                  <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gold/30 focus:outline-none text-white placeholder-gray-400" />
                </div>
              </div>
              <div>
                <textarea name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gold/30 focus:outline-none text-white placeholder-gray-400 resize-none" required></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-gold text-dark py-3 rounded-full font-semibold hover:bg-gold-light transition disabled:opacity-50">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {submitStatus && (
                <p className={`text-center mt-3 ${submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {submitStatus.message}
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;