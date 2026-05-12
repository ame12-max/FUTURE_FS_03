import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { getImageUrl } from '../services/api';

const Favorites = () => {
  const { favorites, removeFavorite, loading } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: getImageUrl(item.image_url),
    };
    addToCart(cartItem, 1);
    toast.success(`${item.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-white animate-pulse">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black/80">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-playfair font-bold text-gold mb-2">My Favorites</h1>
        <p className="text-gray-400 mb-8">Your saved menu items</p>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <FiHeart className="text-6xl text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No favorites yet</p>
            <Link to="/#menu" className="inline-block bg-gold text-black px-6 py-2 rounded-full font-semibold hover:bg-gold-light transition">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-105 transition"
              >
                <Link to={`/menu/${item.id}`}>
                  <img
                    src={getImageUrl(item.image_url) || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFavorite(item.id);
                        }}
                        className="text-red-400 hover:text-red-500 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                    <p className="text-gold font-bold mt-1">${item.price}</p>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="mt-3 w-full bg-gold text-black py-2 rounded-full font-semibold hover:bg-gold-light transition flex items-center justify-center gap-2"
                    >
                      <FiShoppingBag size={16} /> Add to Cart
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;