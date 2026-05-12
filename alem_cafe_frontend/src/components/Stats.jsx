import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaVideo } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const { t } = useLanguage();

  const stats = [
    { label: t('stats.coffeeVarieties'), value: '15+' },
    { label: t('stats.foodOptions'), value: '30+' },
    { label: t('stats.happyCustomers'), value: '5K+' },
    { label: t('stats.rating'), value: '4.9' },
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
            <button className="flex items-center gap-2 bg-gold text-black px-8 py-3 rounded-full font-semibold hover:bg-gold-light transition">
              <FaVideo /> {t('stats.watchStory')}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;