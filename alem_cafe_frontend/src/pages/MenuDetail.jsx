// src/pages/MenuDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { menuItems } from '../data/menuItems';


const MenuDetail = () => {
  const { id } = useParams();
  const item = menuItems.find(i => i.id === parseInt(id));

  if (!item) {
    return <div className="min-h-screen flex items-center justify-center text-white">Item not found</div>;
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black/80">
      <div className="container mx-auto px-6">
        <Link to="/#menu" className="inline-flex items-center gap-2 text-gold hover:text-yellow-400 mb-6">
          <FiArrowLeft /> Back to Menu
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover md:rounded-l-3xl" />
            <div className="p-8">
              <h1 className="text-4xl font-playfair font-bold text-gold mb-2">{item.name}</h1>
              <p className="text-gray-300 text-sm mb-4">{item.category} • {item.calories} cal</p>
              <p className="text-gray-300 mb-6 leading-relaxed">{item.fullDesc}</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gold">${item.price}</span>
                <button className="bg-gold text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MenuDetail;