import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaVideo } from 'react-icons/fa';

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const stats = [
    { label: 'Coffee Varieties', value: '15+' },
    { label: 'Food Options', value: '30+' },
    { label: 'Happy Customers', value: '5K+' },
    { label: 'Rating', value: '4.9' },
  ];
  return (
    <section
      ref={ref}
      className="relative py-20 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold text-gold">{stat.value}</div>
                <div className="text-gray-200 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <button className="flex items-center gap-2 bg-gold text-dark px-8 py-3 rounded-full font-semibold hover:bg-gold-light transition">
              <FaVideo /> Watch Our Story
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;