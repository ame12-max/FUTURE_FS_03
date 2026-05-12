import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, total, itemCount , clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-center">
          <FiShoppingBag className="text-6xl text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-300 mb-4">Your cart is empty</h2>
          <Link to="/#menu" className="bg-gold text-black px-6 py-3 rounded-full font-semibold hover:bg-gold-light transition">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black/80">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-playfair font-bold text-gold mb-8">Shopping Cart</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex gap-4">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="text-gold font-bold">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-white/10 hover:bg-gold/20 transition"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-white/10 hover:bg-gold/20 transition"
                      >
                        <FiPlus size={14} />
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-400 hover:text-red-300 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={clearCart}
                className="text-red-400 hover:text-red-300 text-sm transition"
              >
                Clear Cart
              </button>
            </div>
            
            {/* Order Summary */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-fit">
              <h2 className="text-xl font-playfair font-bold text-gold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({itemCount > 9 ? '9+' : itemCount} items)</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Delivery Fee</span>
                  <span className="text-white">$2.00</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-gold text-xl">${(total + 2).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link 
                to="/checkout"
                className="block w-full bg-gold text-black text-center py-3 rounded-full font-semibold hover:bg-gold-light transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;