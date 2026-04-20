// src/components/Testimonials.jsx
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  { name: 'Sarah M.', text: 'The best coffee in town! The atmosphere is so cozy and the staff are incredibly friendly.', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'David K.', text: 'Alem Café is my go‑to spot for working remotely. Great Wi‑Fi, delicious pastries, and amazing coffee.', rating: 5, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { name: 'Meron T.', text: 'I love their traditional Ethiopian coffee ceremony. Authentic and heartwarming experience.', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { name: 'John D.', text: 'The golden turmeric latte is a must‑try. And the service is always impeccable.', rating: 5, avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" ref={ref} className="py-24 bg-cafe-cream">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-cafe-brown">What Our Guests Say</h2>
          <p className="text-gray-700">Loved by many, recommended by all</p>
        </motion.div>
        <div className="max-w-3xl mx-auto relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <img src={testimonials[current].avatar} alt={testimonials[current].name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-cafe-gold" />
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(testimonials[current].rating)].map((_, i) => <FaStar key={i} className="text-cafe-gold" />)}
            </div>
            <p className="text-gray-700 text-lg italic">"{testimonials[current].text}"</p>
            <h4 className="mt-4 font-semibold text-cafe-brown">— {testimonials[current].name}</h4>
          </div>
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 bg-cafe-gold p-2 rounded-full shadow-md"><FaChevronLeft /></button>
          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 bg-cafe-gold p-2 rounded-full shadow-md"><FaChevronRight /></button>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;