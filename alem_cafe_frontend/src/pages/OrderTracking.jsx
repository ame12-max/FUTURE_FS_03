import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiClock, FiTruck, FiPackage, FiCoffee, FiArrowLeft } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/common/ConfirmModal';

const OrderTracking = () => {
  const { id } = useParams();
  const { convertPrice, getSymbol } = useCurrency();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [lastStatus, setLastStatus] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const statusFlow = [
    { key: 'pending', label: t('status.pending'), icon: FiClock, color: 'text-yellow-500', bg: 'bg-yellow-500/20' },
    { key: 'confirmed', label: t('status.confirmed'), icon: FiCheck, color: 'text-blue-500', bg: 'bg-blue-500/20' },
    { key: 'preparing', label: t('status.preparing'), icon: FiCoffee, color: 'text-purple-500', bg: 'bg-purple-500/20' },
    { key: 'ready', label: t('status.ready'), icon: FiPackage, color: 'text-orange-500', bg: 'bg-orange-500/20' },
    { key: 'delivered', label: t('status.delivered'), icon: FiTruck, color: 'text-green-500', bg: 'bg-green-500/20' },
    { key: 'cancelled', label: t('status.cancelled'), icon: FiX, color: 'text-red-500', bg: 'bg-red-500/20' },
  ];

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getById(id);
      setOrder(res.data);
      setLastStatus(res.data.status);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      toast.error(t('orderNotFound'));
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Poll for status changes every 10 seconds
  useEffect(() => {
    if (!order) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await orderAPI.getById(id);
        if (res.data.status !== lastStatus) {
          setOrder(res.data);
          setLastStatus(res.data.status);
          toast.success(`${t('statusUpdated')} ${res.data.status}`, { duration: 3000 });
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [id, lastStatus, order]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await orderAPI.cancelOrder(id);
      toast.success(t('orderCancelled'));
      fetchOrder();
      setShowCancelModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || t('cancelFailed'));
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-white animate-pulse">{t('common.loading')}</div>
      </div>
    );
  }

  if (!order) return null;

  const currentStatusIndex = statusFlow.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';
  const canCancel = order.status === 'pending';

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black/80">
      <div className="container mx-auto px-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gold hover:text-yellow-400 mb-6">
          <FiArrowLeft /> {t('backToDashboard')}
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Order Header */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-playfair font-bold text-gold">{t('order')} #{order.id}</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {t('placedOn')} {new Date(order.created_at).toLocaleDateString()} {t('at')} {new Date(order.created_at).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex gap-3">
                {canCancel && !isCancelled && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={cancelling}
                    className="px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {t('cancelOrder')}
                  </button>
                )}
                <div className={`px-4 py-2 rounded-full font-semibold ${
                  order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                  order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                  'bg-gold/20 text-gold'
                }`}>
                  {order.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Timeline */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-playfair font-bold text-gold mb-6">{t('orderStatus')}</h2>
            <div className="relative">
              <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-5 md:gap-4">
                {statusFlow.map((status, idx) => {
                  const isCompleted = idx <= currentStatusIndex && !isCancelled;
                  const isActive = idx === currentStatusIndex;
                  const Icon = status.icon;
                  
                  if (isCancelled && status.key !== 'cancelled') return null;
                  if (isCancelled && status.key === 'cancelled') {
                    return (
                      <div key={status.key} className="flex md:flex-col items-center gap-3 md:gap-2">
                        <div className="bg-red-500/20 p-3 rounded-full">
                          <Icon className="text-red-500 text-xl" />
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-red-400">{status.label}</p>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={status.key} className="flex md:flex-col items-center gap-3 md:gap-2">
                      <div className={`p-3 rounded-full transition-all duration-300 ${
                        isCompleted ? status.bg : 'bg-white/10'
                      }`}>
                        <Icon className={`text-xl ${
                          isCompleted ? status.color : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold text-sm ${
                          isCompleted ? status.color : 'text-gray-500'
                        }`}>
                          {status.label}
                        </p>
                        {isActive && (
                          <p className="text-xs text-gold mt-1 animate-pulse">{t('current')}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-xl font-playfair font-bold text-gold mb-4">{t('orderItems')}</h2>
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10">
                    <div>
                      <span className="text-white font-medium">{item.quantity}x</span>
                      <span className="text-gray-300 ml-2">{item.item_name}</span>
                    </div>
                    <span className="text-gold">{getSymbol()}{convertPrice(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gold/30">
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('total')}</span>
                  <span className="text-gold font-bold text-xl">{getSymbol()}{convertPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
              <h2 className="text-xl font-playfair font-bold text-gold mb-4">{t('deliveryInfo')}</h2>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-400">{t('name')}:</span> {order.customer_name}</p>
                <p><span className="text-gray-400">{t('email')}:</span> {order.customer_email}</p>
                <p><span className="text-gray-400">{t('phone')}:</span> {order.customer_phone}</p>
                <p><span className="text-gray-400">{t('orderType')}:</span> {order.order_type?.replace('_', ' ').toUpperCase()}</p>
                {order.delivery_address && (
                  <p><span className="text-gray-400">{t('address')}:</span> {order.delivery_address}</p>
                )}
                {order.payment_method && (
                  <p><span className="text-gray-400">{t('payment')}:</span> {order.payment_method.toUpperCase()}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title={t('cancelOrderTitle')}
        message={t('cancelOrderMessage', { orderId: order?.id })}
        confirmText={t('yesCancel')}
        cancelText={t('noGoBack')}
        type="danger"
      />
    </div>
  );
};

export default OrderTracking;