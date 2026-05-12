import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CurrencyProvider, useCurrency } from '../context/CurrencyContext';
import { orderAPI } from '../services/api';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiUser, FiMail, FiPhone, FiMapPin, FiCoffee, FiCreditCard } from 'react-icons/fi';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const { convertPrice, getSymbol } = useCurrency();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    deliveryAddress: '',
    orderType: 'dine_in',
    paymentMethod: 'cash',
    specialInstructions: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(item => ({ id: item.id, quantity: item.quantity }));
      const res = await orderAPI.create({ ...formData, items });
      clearCart();
      navigate(`/order-confirmation/${res.data.orderId}`);
    } catch (err) {
      alert('Order failed: ' + err.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <FiShoppingBag className="text-6xl text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl text-gold mb-4">Your cart is empty</h2>
          <Link to="/#menu" className="inline-block bg-gold text-black px-6 py-3 rounded-full font-semibold hover:bg-gold-light transition">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black/90">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gold mb-2">Checkout</h1>
          <p className="text-gray-300 mb-8">Complete your order to enjoy delicious food</p>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary - Left Column */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 sticky top-28 border border-white/10">
                <h2 className="text-xl font-playfair font-bold text-gold mb-4 flex items-center gap-2">
                  <FiShoppingBag /> Order Summary
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/10">
                      <div className="flex-1">
                        <span className="text-white font-medium">{item.quantity}x</span>
                        <span className="text-gray-300 ml-2">{item.name}</span>
                      </div>
                      <span className="text-gold">{getSymbol()}{convertPrice(total)}</span>

                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gold/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white">{getSymbol()}{convertPrice(total)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-300">Delivery Fee</span>
                    <span className="text-white">{getSymbol()}{convertPrice(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20">
                    <span className="text-xl font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-gold">{getSymbol()}{convertPrice(total + 2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form - Right Column */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <form onSubmit={handleSubmit} className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-playfair font-bold text-gold mb-6">Delivery Information</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 flex items-center gap-2">
                      <FiUser /> Full Name *
                    </label>
                    <input 
                      type="text" 
                      value={formData.customerName} 
                      onChange={e => setFormData({ ...formData, customerName: e.target.value })} 
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 flex items-center gap-2">
                      <FiMail /> Email *
                    </label>
                    <input 
                      type="email" 
                      value={formData.customerEmail} 
                      onChange={e => setFormData({ ...formData, customerEmail: e.target.value })} 
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 flex items-center gap-2">
                      <FiPhone /> Phone *
                    </label>
                    <input 
                      type="tel" 
                      value={formData.customerPhone} 
                      onChange={e => setFormData({ ...formData, customerPhone: e.target.value })} 
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 flex items-center gap-2">
                      <FiCoffee /> Order Type
                    </label>
                    <select 
                      value={formData.orderType} 
                      onChange={e => setFormData({ ...formData, orderType: e.target.value })} 
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition"
                    >
                      <option value="dine_in">Dine In</option>
                      <option value="takeaway">Takeaway</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-gray-300 text-sm mb-2 flex items-center gap-2">
                    <FiMapPin /> Delivery Address (if delivery)
                  </label>
                  <textarea 
                    value={formData.deliveryAddress} 
                    onChange={e => setFormData({ ...formData, deliveryAddress: e.target.value })} 
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition"
                    rows="2"
                    placeholder="Street, city, building number..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 flex items-center gap-2">
                      <FiCreditCard /> Payment Method
                    </label>
                    <select 
                      value={formData.paymentMethod} 
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} 
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition"
                    >
                      <option value="cash">Cash on Delivery</option>
                      <option value="card">Card on Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Special Instructions (optional)</label>
                    <input 
                      type="text" 
                      value={formData.specialInstructions} 
                      onChange={e => setFormData({ ...formData, specialInstructions: e.target.value })} 
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition"
                      placeholder="Any special requests?"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full mt-6 bg-gold text-black py-4 rounded-full font-semibold hover:bg-gold-light transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `Place Order • ${getSymbol()}${convertPrice(total + 2)}`
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;