// src/components/MenuSection.jsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiHeart, FiPlus } from 'react-icons/fi';

const menuItems = [
  {
    id: 1,
    name: 'Alem Signature Burger',
    desc: 'Juicy 100% beef patty with cheddar & special sauce',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
  },
  {
    id: 2,
    name: 'Creamy Alfredo Pasta',
    desc: 'Rich & creamy white sauce with grilled chicken',
    price: 6.49,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600',
  },
  {
    id: 3,
    name: 'Choco Lava Cake',
    desc: 'Warm chocolate lava with vanilla ice cream',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',
  },
  {
    id: 4,
    name: 'Iced Caramel Latte',
    desc: 'Smooth espresso with caramel & cold milk',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600',
  },
];

const MenuSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  const addToCart = (item) => {
    alert(`${item.name} added to cart (demo)`);
  };

  const toggleLike = (id) => {
    alert(`❤️ Liked item ${id} (demo)`);
  };

  return (
  <section id="menu" ref={ref} className="py-20 bg-black/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gold">OUR MENU</h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Delicious eats made for you — from hearty meals to delightful treats, everything is crafted with love and the freshest ingredients.
          </p>
          <a href="#fullmenu" className="inline-block mt-3 text-gold border-b border-gold pb-1 hover:text-gold-light transition">
            View Full Menu →
          </a>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-105 transition duration-300"
            >
              <img src={item.image} alt={item.name} className="w-full h-56 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <button onClick={() => toggleLike(item.id)} className="text-gold hover:text-red-500 transition">
                    <FiHeart size={20} />
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gold font-bold text-xl">${item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-gold text-dark p-2 rounded-full hover:bg-gold-light transition"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;