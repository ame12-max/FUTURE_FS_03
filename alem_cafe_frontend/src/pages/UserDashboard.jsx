import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';

const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { convertPrice, getSymbol } = useCurrency();


  useEffect(() => {
    if (user?.email) {
      orderAPI.getByEmail(user.email)
        .then(res => setOrders(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-white animate-pulse">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black/80">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-playfair font-bold text-gold mb-2">My Dashboard</h1>
          <p className="text-gray-300 mb-8">Welcome back, {user?.name}</p>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-playfair font-bold text-gold mb-4 flex items-center gap-2">
              <FiShoppingBag /> Order History
            </h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No orders yet.</p>
                <Link to="/#menu" className="inline-block bg-gold text-black px-6 py-2 rounded-full font-semibold hover:bg-gold-light transition">
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/order-tracking/${order.id}`}
                    className="block bg-white/5 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-3">
                      <div>
                        <p className="text-gold font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">Total: {getSymbol()}{convertPrice(order.total_amount)}</p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'delivered' ? 'bg-green-500 text-white' :
                          order.status === 'cancelled' ? 'bg-red-500 text-white' :
                          order.status === 'pending' ? 'bg-yellow-500 text-black' :
                          'bg-blue-500 text-white'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;