import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaCoffee, FaLeaf, FaHome } from 'react-icons/fa';

const features = [
  { icon: FaCoffee, title: 'Premium Coffee', desc: 'Finest Beans' },
  { icon: FaLeaf, title: 'Fresh Ingredients', desc: 'Daily & Local' },
  { icon: FaHome, title: 'Cozy Ambiente', desc: 'Feel at Home' },
];

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  return (
    <section ref={ref} className="py-16 bg-black/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <feat.icon className="text-5xl text-gold mx-auto mb-3" />
              <h3 className="text-xl font-bold">{feat.title}</h3>
              <p className="text-gray-400">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;