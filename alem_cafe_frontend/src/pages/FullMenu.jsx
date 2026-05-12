import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiArrowLeft, FiPlus } from 'react-icons/fi';
import { menuAPI, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FullMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState({});
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('likedMenuItems');
    if (saved) setLikedItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuAPI.getAll();
        setMenuItems(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load menu:', err);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const toggleLike = (id) => {
    const updated = { ...likedItems, [id]: !likedItems[id] };
    setLikedItems(updated);
    localStorage.setItem('likedMenuItems', JSON.stringify(updated));
  };

  const handleAddToCart = (item) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: getImageUrl(item.image_url) || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    };
    
    addToCart(cartItem, 1);
    
    if (user) {
      toast.success(`${item.name} added to cart!`);
    } else {
      toast.success(`${item.name} added to cart! (Login to save permanently)`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-white animate-pulse">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black/80">
      <div className="container mx-auto px-6">
        <Link to="/#menu" className="inline-flex items-center gap-2 text-gold hover:text-yellow-400 mb-6">
          <FiArrowLeft /> Back to Menu
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gold">Full Menu</h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Explore our complete selection of delicious eats and drinks.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-105 transition duration-300"
            >
              <Link to={`/menu/${item.id}`} className="block">
                <img 
                  src={getImageUrl(item.image_url) || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'} 
                  alt={item.name} 
                  className="w-full h-56 object-cover" 
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleLike(item.id);
                      }}
                      className="text-gold hover:text-red-500 transition"
                    >
                      {likedItems[item.id] ? (
                        <FiHeart className="fill-red-500 text-red-500" size={20} />
                      ) : (
                        <FiHeart size={20} />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gold font-bold text-xl">${parseFloat(item.price).toFixed(2)}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="bg-gold text-black p-2 rounded-full hover:bg-gold-light transition"
                      aria-label="Add to cart"
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullMenu;