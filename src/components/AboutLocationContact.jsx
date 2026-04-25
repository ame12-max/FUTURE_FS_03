// src/components/AboutLocationContact.jsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaPhone, FaEnvelope, FaClock, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

const AboutLocationContact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <section id="about" ref={ref} className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6"
          >
            <h3 className="text-2xl font-playfair font-bold text-gold mb-3">About Alem Cafe</h3>
            <p className="text-gray-300">
              Alem Cafe is more than just a cafe. It’s a place where great food, amazing coffee, and good conversations come together. Come in, relax and enjoy!
            </p>
            <img
              src='https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600'
              alt="cafe interior"
              className="mt-4 rounded-xl w-full h-32 object-cover"
            />
          </motion.div>

          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6"
          >
            <h3 className="text-2xl font-playfair font-bold text-gold mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-gold" /> Our Location
            </h3>
            <div className="h-48 rounded-xl overflow-hidden mb-3">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.0!2d38.75!3d9.03!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDEnNDguMCJOIDM4wrA0NScwMC4wIkU!5e0!3m2!1sen!2set!4v1610000000000!5m2!1sen!2set"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <p className="text-gray-300">123 Coffee Street, Addis Ababa, Ethiopia</p>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6"
          >
            <h3 className="text-2xl font-playfair font-bold text-gold mb-3">Contact Us</h3>
            <div className="space-y-3">
              <p className="flex items-center gap-2"><FaPhone className="text-gold" /> +251 912 345 678</p>
              <p className="flex items-center gap-2"><FaEnvelope className="text-gold" /> hello@alemcafe.com</p>
              <p className="flex items-center gap-2"><FaClock className="text-gold" /> 07:00 AM – 11:00 PM</p>
              <a
                href="https://wa.me/251912345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition mt-2"
              >
                <FaWhatsapp /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutLocationContact;