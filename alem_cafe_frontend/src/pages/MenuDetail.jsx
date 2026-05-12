import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiShoppingCart,
  FiClock,
  FiInfo,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { menuAPI, getImageUrl } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Reviews from "../components/Menu/Reviews";
import { useCurrency } from '../context/CurrencyContext';


const MenuDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { convertPrice, getSymbol } = useCurrency();

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const res = await menuAPI.getOne(id);
        setItem(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load menu item:", err);
        setError("Item not found");
        setLoading(false);
      }
    };
    fetchMenuItem();
  }, [id]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!item) return;
    const cartItem = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: getImageUrl(item.image_url) || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    };
    addToCart(cartItem, quantity);
    toast.success(`${quantity} × ${item.name} added to cart!`);
  };

  // Parse dietary tags into array
  const dietaryTags = item?.dietary_tags
    ? item.dietary_tags.split(",").map((tag) => tag.trim())
    : [];

  // Parse ingredients into array
  const ingredients = item?.ingredients
    ? item.ingredients.split(",").map((ing) => ing.trim())
    : [];

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-white animate-pulse">Loading menu item...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">
            {error || "Item not found"}
          </p>
          <Link
            to="/#menu"
            className="inline-flex items-center gap-2 text-gold hover:text-yellow-400"
          >
            <FiArrowLeft /> Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black/80">
      <div className="container mx-auto px-6">
        <Link
          to="/#menu"
          className="inline-flex items-center gap-2 text-gold hover:text-yellow-400 mb-6"
        >
          <FiArrowLeft /> Back to Menu
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image */}
            <img
              src={
                getImageUrl(item.image_url) ||
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
              }
              alt={item.name}
              className="w-full h-full object-cover lg:rounded-l-3xl min-h-[300px] lg:min-h-[500px]"
            />

            {/* Details */}
            <div className="p-6 lg:p-8">
              <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-gold mb-2">
                {item.name}
              </h1>

              {/* Rating */}
              {item.reviews && item.reviews.length > 0 ? (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => {
                      const avgRating = item.averageRating || 0;
                      const filled = i < Math.floor(avgRating);
                      const halfFilled =
                        i === Math.floor(avgRating) && avgRating % 1 >= 0.5;
                      return (
                        <FiStar
                          key={i}
                          className={`text-sm ${filled || halfFilled ? "text-gold fill-gold" : "text-gray-500"}`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm text-gray-400">
                    {item.averageRating
                      ? `${item.averageRating} / 5 (${item.reviews.length} review${item.reviews.length !== 1 ? "s" : ""})`
                      : "No reviews yet"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="text-sm text-gray-500" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">No reviews yet</span>
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gold">{getSymbol()}{convertPrice(item.price)}</span>

              </div>

              {/* Dietary Tags */}
              {dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {item.full_description || item.description}
              </p>

              {/* Preparation Time */}
              <div className="flex items-center gap-4 mb-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <FiClock />
                  <span>Prep: {item.preparation_time || 15} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers />
                  <span>Serves: 1</span>
                </div>
                {item.calories && (
                  <div className="flex items-center gap-2">
                    <FiInfo />
                    <span>{item.calories} cal</span>
                  </div>
                )}
              </div>

              {/* Ingredients */}
              {ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gold mb-2">
                    Ingredients
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {ingredients.map((ing) => (
                      <li key={ing}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Allergens */}
              {item.allergens && (
                <div className="mb-6 p-3 bg-yellow-500/10 rounded-lg">
                  <p className="text-sm text-yellow-400">
                    <strong>Allergens:</strong> {item.allergens}
                  </p>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="border-t border-white/20 pt-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 rounded-full bg-white/10 hover:bg-gold/20 transition"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="text-white text-xl w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="p-2 rounded-full bg-white/10 hover:bg-gold/20 transition"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gold text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition flex items-center justify-center gap-2"
                  >
                    <FiShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
              <Reviews menuItemId={item.id} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MenuDetail;