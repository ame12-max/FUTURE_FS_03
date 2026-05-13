import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiCheckCircle, 
  FiClock, 
  FiTruck, 
  FiCoffee, 
  FiXCircle,
  FiEye,
  FiBell
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

const OrderManagement = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { convertPrice, getSymbol } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const statuses = [
    { key: 'pending', label: t('status.pending'), icon: FiClock, color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
    { key: 'confirmed', label: t('status.confirmed'), icon: FiCheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/20' },
    { key: 'preparing', label: t('status.preparing'), icon: FiCoffee, color: 'text-purple-500', bg: 'bg-purple-500/20' },
    { key: 'ready', label: t('status.ready'), icon: FiPackage, color: 'text-orange-500', bg: 'bg-orange-500/20' },
    { key: 'delivered', label: t('status.delivered'), icon: FiTruck, color: 'text-green-500', bg: 'bg-green-500/20' },
    { key: 'cancelled', label: t('status.cancelled'), icon: FiXCircle, color: 'text-red-500', bg: 'bg-red-500/20' },
  ];

  useEffect(() => {
    fetchOrders();
    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await adminAPI.getOrders();
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error(t('orderManagement.fetchError'));
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success(t('orderManagement.statusUpdated', { orderId, newStatus }));
      fetchOrders();
      
      // Add notification
      addNotification(t('orderManagement.notificationMessage', { orderId, newStatus }));
    } catch (err) {
      toast.error(t('orderManagement.updateError'));
    } finally {
      setUpdating(false);
    }
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const getStatusIcon = (status) => {
    const found = statuses.find(s => s.key === status);
    return found ? found.icon : FiClock;
  };

  const getStatusColor = (status) => {
    const found = statuses.find(s => s.key === status);
    return found ? found.color : 'text-gray-500';
  };

  const getStatusBg = (status) => {
    const found = statuses.find(s => s.key === status);
    return found ? found.bg : 'bg-gray-500/20';
  };

  if (!isAdmin) return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-white animate-pulse">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black/80">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-playfair font-bold text-gold">{t('orderManagement.title')}</h1>
         
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-24 right-6 z-50 space-y-2">
            {notifications.map(notif => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="bg-black/90 backdrop-blur-xl border border-gold/30 rounded-xl p-3 flex items-center gap-3 shadow-lg"
              >
                <FiBell className="text-gold" />
                <div>
                  <p className="text-white text-sm">{notif.message}</p>
                  <p className="text-gray-400 text-xs">{notif.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl">
              <FiPackage className="text-5xl text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">{t('orderManagement.noOrders')}</p>
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-gold/30 transition"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gold">{t('orderManagement.orderNumber')} #{order.id}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBg(order.status)} ${getStatusColor(order.status)}`}>
                      <getStatusIcon status={order.status} className="inline mr-1" />
                      {t(`status.${order.status}`, order.status)}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-gold hover:text-yellow-400 transition"
                    >
                      <FiEye size={18} />
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                {selectedOrder === order.id && (
                  <div className="p-4 bg-white/5">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">{t('orderManagement.customer')}</p>
                        <p className="text-white">{order.customer_name}</p>
                        <p className="text-gray-300 text-sm">{order.customer_email}</p>
                        <p className="text-gray-300 text-sm">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">{t('orderManagement.orderDetails')}</p>
                        <p className="text-white">{t('orderManagement.type')}: {t(`orderType.${order.order_type}`, order.order_type?.replace('_', ' ')?.toUpperCase())}</p>
                        <p className="text-white">{t('orderManagement.payment')}: {order.payment_method?.toUpperCase()}</p>
                        <p className="text-white">{t('orderManagement.total')}: {getSymbol()}{convertPrice(order.total_amount)}</p>
                        {order.delivery_address && (
                          <p className="text-gray-300 text-sm">{t('orderManagement.address')}: {order.delivery_address}</p>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-2">{t('orderManagement.items')}</p>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-white">{item.quantity}x {item.item_name}</span>
                              <span className="text-gold">{getSymbol()}{convertPrice(item.unit_price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Update */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <p className="text-gray-400 text-sm mb-2">{t('orderManagement.updateStatus')}</p>
                        <div className="flex flex-wrap gap-2">
                          {statuses.map((status) => {
                            const currentIndex = statuses.findIndex(s => s.key === order.status);
                            const statusIndex = statuses.findIndex(s => s.key === status.key);
                            // Only show statuses after current or same
                            if (statusIndex < currentIndex && status.key !== order.status) return null;
                            if (status.key === 'cancelled' && currentIndex > 0) return null;
                            
                            return (
                              <button
                                key={status.key}
                                onClick={() => updateOrderStatus(order.id, status.key)}
                                disabled={updating || order.status === status.key}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1 ${
                                  order.status === status.key
                                    ? `${status.bg} ${status.color} cursor-default`
                                    : 'bg-white/10 text-gray-300 hover:bg-gold/20 hover:text-gold'
                                }`}
                              >
                                <status.icon size={12} />
                                {status.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;