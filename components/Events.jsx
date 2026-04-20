import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiCalendar, FiMusic, FiUsers } from 'react-icons/fi';

const Events = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  return (
    <section id="events" ref={ref} className="py-24 bg-cafe-beige">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-cafe-brown">Events & Private Dining</h2>
          <p className="text-gray-700">Host your special moments with us</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition"><FiCalendar className="text-4xl text-cafe-gold mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">Private Parties</h3><p className="text-gray-600">Birthdays, anniversaries, corporate events – we tailor the experience.</p></div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition"><FiMusic className="text-4xl text-cafe-gold mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">Live Music Nights</h3><p className="text-gray-600">Every Friday & Saturday, enjoy local jazz and acoustic sets.</p></div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition"><FiUsers className="text-4xl text-cafe-gold mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">Coffee Workshops</h3><p className="text-gray-600">Learn the art of Ethiopian coffee ceremony and latte art.</p></div>
        </div>
      </div>
    </section>
  );
};
export default Events;