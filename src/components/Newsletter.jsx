// src/components/Newsletter.jsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaCoffee } from 'react-icons/fa';

const Newsletter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <section ref={ref} className="py-16"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8"
        >
          {/* Icon on the left */}
          <div className="flex-shrink-0">
            <FaCoffee className="text-6xl text-gold" />
          </div>
          {/* Content on the right */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gold">Join our Coffee Club</h2>
            <p className="text-gray-300 mt-2 mb-4">Get exclusive offers, free treats, and the latest updates.</p>
            <div className="flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-gold/30 focus:outline-none text-white placeholder-gray-400"
              />
              <button className="bg-gold text-dark px-6 py-3 rounded-full font-semibold hover:bg-gold-light transition">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;