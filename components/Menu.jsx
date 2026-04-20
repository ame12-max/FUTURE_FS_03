import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaCoffee, FaMugHot, FaCookie, FaPizzaSlice } from 'react-icons/fa';

const menuSections = [
  { title: 'Coffee', icon: FaCoffee, items: [{ name: 'Ethiopian Yirgacheffe', price: '$4.5', desc: 'Floral, citrus notes', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400' }, { name: 'Sidama Natural', price: '$4.5', desc: 'Berry, chocolate', image: 'https://ibb.co/Fk13C2jk' }, { name: 'Espresso', price: '$3.0', desc: 'Rich, bold', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400' }] },
  { title: 'Tea & More', icon: FaMugHot, items: [{ name: 'Matcha Latte', price: '$5.0', desc: 'Ceremonial grade', image: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400' }, { name: 'Spiced Chai', price: '$4.0', desc: 'House blend', image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=400' }, { name: 'Golden Turmeric', price: '$4.5', desc: 'Anti-inflammatory', image: 'https://images.unsplash.com/photo-1605887084699-37f3c8bcec5c?w=400' }] },
  { title: 'Pastries', icon: FaCookie, items: [{ name: 'Croissant', price: '$3.5', desc: 'Buttery, flaky', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' }, { name: 'Cheese Cake', price: '$5.0', desc: 'Creamy, graham crust', image: 'https://images.unsplash.com/photo-1533134242443-d4fd45e8b4fb?w=400' }, { name: 'Chocolate Brownie', price: '$4.0', desc: 'Fudgy, walnut', image: 'https://images.unsplash.com/photo-1580313718197-8c5e6c0e7a5a?w=400' }] },
  { title: 'Savory', icon: FaPizzaSlice, items: [{ name: 'Quiche Lorraine', price: '$7.5', desc: 'Egg, bacon, cheese', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' }, { name: 'Avocado Toast', price: '$6.5', desc: 'Sourdough, poached egg', image: 'https://images.unsplash.com/photo-1525351486363-ef6f67a6fa67?w=400' }, { name: 'Hummus Wrap', price: '$8.0', desc: 'Vegan, tahini', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' }] },
];

const Menu = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  return (
    <section id="menu" ref={ref} className="py-24 bg-cafe-beige">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-cormorant font-bold text-cafe-brown">Our Menu</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mt-2">Handcrafted with love, served with a smile</p>
        </motion.div>
        <div className="space-y-16">
          {menuSections.map((section, idx) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: idx * 0.1 }}>
              <div className="flex items-center gap-3 mb-6">
                <section.icon className="text-3xl text-cafe-gold" />
                <h3 className="text-3xl font-cormorant font-bold text-cafe-brown">{section.title}</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {section.items.map((item, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xl font-semibold text-cafe-darkbrown">{item.name}</h4>
                        <span className="text-cafe-gold font-bold">{item.price}</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Menu;