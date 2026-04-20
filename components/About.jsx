import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <section id="about" ref={ref} className="py-24 bg-cafe-cream">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }} className="rounded-2xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Coffee" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-cafe-brown mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">Alem Café was born from a passion for exceptional coffee and Ethiopian hospitality. We source beans directly from local farmers, roast in small batches, and brew each cup with care.</p>
            <p className="text-gray-700 mb-6 leading-relaxed">Our space is designed as a sanctuary – for catching up with friends, working remotely, or savoring a quiet moment. Experience the warmth of Alem.</p>
            <div className="flex gap-8">
              <div><span className="text-3xl font-bold text-cafe-gold">15+</span><p className="text-sm text-gray-600">Coffee Blends</p></div>
              <div><span className="text-3xl font-bold text-cafe-gold">200+</span><p className="text-sm text-gray-600">Daily Visitors</p></div>
              <div><span className="text-3xl font-bold text-cafe-gold">4.9</span><p className="text-sm text-gray-600">Google Rating</p></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default About;