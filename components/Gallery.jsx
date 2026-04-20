import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const images = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600',
  'https://images.unsplash.com/photo-1507133750040-4c8f57023a4a?w=600', 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=600',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600', 'https://images.unsplash.com/photo-1478229801495-e2d6f10b4e24?w=600',
  'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600', 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=600',
];
const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  return (
    <section id="gallery" ref={ref} className="py-24 bg-cafe-cream">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-cafe-brown">Gallery</h2>
          <p className="text-gray-700">A visual journey through Alem Café</p>
        </motion.div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: idx * 0.05 }} whileHover={{ scale: 1.02 }} className="break-inside-avoid">
              <img src={img} alt={`Gallery ${idx}`} className="rounded-xl shadow-md w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Gallery;