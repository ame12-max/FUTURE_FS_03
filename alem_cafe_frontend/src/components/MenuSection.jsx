// src/components/MenuSection.jsx
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { menuItems } from '../data/menuItems';


const MenuSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const [likedItems, setLikedItems] = useState({});

  const featuredItems = menuItems.slice(0, 4); 
  // Load likes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("likedMenuItems");
    if (saved) setLikedItems(JSON.parse(saved));
  }, []);

  const toggleLike = (id) => {
    const updated = { ...likedItems, [id]: !likedItems[id] };
    setLikedItems(updated);
    localStorage.setItem("likedMenuItems", JSON.stringify(updated));
  };

  const handleBuyNow = async (item) => {
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleBuyNow(item);
      }}
      className="bg-gold text-dark p-2 rounded-full hover:bg-gold-light transition"
    >
      Buy Now
    </button>;
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
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gold">
            OUR MENU
          </h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Delicious eats made for you — from hearty meals to delightful
            treats, everything is crafted with love and the freshest
            ingredients.
          </p>
          <Link
            to="/full-menu"
            className="inline-block mt-3 text-gold border-b border-gold pb-1 hover:text-gold-light transition"
          >
            View Full Menu →
          </Link>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-105 transition duration-300 group"
            >
              {/* Whole card is clickable (Link) except the buttons */}
              <Link to={`/menu/${item.id}`} className="block">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    {/* Like button - stops propagation to prevent navigation */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleLike(item.id);
                      }}
                      className="text-gold hover:text-red-500 transition"
                    >
                      {likedItems[item.id] ? (
                        <FiHeart
                          className="fill-red-500 text-red-500"
                          size={20}
                        />
                      ) : (
                        <FiHeart size={20} />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gold font-bold text-xl">
                      ${item.price}
                    </span>
                    {/* Plus button - stops propagation */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleBuyNow(item);
                      }}
                      className="bg-gold text-dark p-2 rounded-full hover:bg-gold-light transition"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
