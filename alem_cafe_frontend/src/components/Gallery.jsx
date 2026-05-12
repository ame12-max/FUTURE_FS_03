import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const allImages = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600',
  'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=600',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
];

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const { t } = useLanguage();
  const displayedImages = allImages.slice(0, 3);

  return (
    <section id="gallery" ref={ref} className="py-20 bg-black/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gold">{t('gallery.title')}</h2>
          <p className="text-gray-300 mt-2">{t('gallery.subtitle')}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {displayedImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="overflow-hidden rounded-xl shadow-md"
            >
              <img src={img} alt={`Gallery ${idx}`} className="w-full h-64 object-cover hover:scale-105 transition duration-300" />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button
            onClick={() => alert(t('gallery.alert'))}
            className="px-6 py-3 border border-gold text-gold rounded-full hover:bg-gold/20 transition font-semibold"
          >
            {t('gallery.button')} →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;