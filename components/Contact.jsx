import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); console.log(formData); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); setFormData({ name: '', email: '', message: '' }); };
  const info = [
    { icon: FiMapPin, text: 'Bole Road, Addis Ababa, Ethiopia', label: 'Visit Us' },
    { icon: FiPhone, text: '+251 912 345 678', label: 'Call Us' },
    { icon: FiMail, text: 'hello@alemcafe.com', label: 'Email Us' },
    { icon: FiClock, text: 'Mon–Sun: 7am – 10pm', label: 'Hours' },
  ];
  return (
    <section id="contact" ref={ref} className="py-24 bg-cafe-beige">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-cafe-brown">Get in Touch</h2>
          <p className="text-gray-700">We'd love to hear from you</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {info.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl"><item.icon className="text-2xl text-cafe-gold" /><div><p className="text-xs text-gray-500">{item.label}</p><p className="text-cafe-darkbrown font-medium">{item.text}</p></div></div>
            ))}
            <div className="h-64 rounded-xl overflow-hidden shadow-md"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0!2d38.75!3d9.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDEnNDguMCJOIDM4wrA0NScwMC4wIkU!5e0!3m2!1sen!2set!4v1610000000000!5m2!1sen!2set" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe></div>
          </div>
          <form onSubmit={handleSubmit} className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg space-y-4">
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-cafe-gold" required />
            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
            <textarea name="message" rows="4" placeholder="Your Message..." value={formData.message} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
            <button type="submit" className="w-full bg-cafe-gold hover:bg-cafe-brown text-cafe-darkbrown hover:text-white py-3 rounded-full transition font-semibold">Send Message</button>
            {submitted && <p className="text-green-600 text-sm text-center">Thanks! We'll reply soon.</p>}
          </form>
        </div>
      </div>
    </section>
  );
};
export default Contact;