import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { menuAPI, getImageUrl } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

const MenuSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Fetch menu items from API (only available items)
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuAPI.getAll();
        // Filter to only show available items
        const availableItems = res.data.filter(item => item.is_available === 1);
        setMenuItems(availableItems);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load menu:", err);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
      image: getImageUrl(item.image_url) || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    };

    addToCart(cartItem, 1);

    if (user) {
      toast.success(`${item.name} added to cart!`, {
        duration: 2000,
        position: "bottom-center",
      });
    } else {
      toast.success(`${item.name} added to cart! (Login to save permanently)`, {
        duration: 3000,
        position: "bottom-center",
      });
    }
  };

  const handleFavorite = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  };

  // Map API data with proper image URL using getImageUrl
  const mappedItems = menuItems.map((item) => ({
    id: item.id,
    name: item.name,
    desc: item.description,
    price: parseFloat(item.price).toFixed(2),
    image: getImageUrl(item.image_url) || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    originalPrice: parseFloat(item.price),
    image_url: item.image_url,
  }));

  const featuredItems = mappedItems.slice(0, 4);

  if (loading) {
    return (
      <section id="menu" ref={ref} className="py-20 bg-black/50">
        <div className="container mx-auto px-6 text-center">
          <div className="text-gray-300">Loading menu...</div>
        </div>
      </section>
    );
  }

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
              <Link to={`/menu/${item.id}`} className="block">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white">
                      {item.name}
                    </h3>
                    <button
                      onClick={(e) => handleFavorite(e, item)}
                      className="text-gold hover:text-red-500 transition"
                    >
                      {isFavorite(item.id) ? (
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
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart({
                          id: item.id,
                          name: item.name,
                          price: item.originalPrice,
                          image_url: item.image_url,
                        });
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
    </section>
  );
};

export default MenuSection;