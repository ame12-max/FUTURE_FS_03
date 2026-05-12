import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { useCurrency } from '../context/CurrencyContext';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { convertPrice, getSymbol } = useCurrency();

  useEffect(() => {
    orderAPI.getById(id)
      .then(res => setOrder(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading...</div>;
  if (!order) return <div className="min-h-screen pt-32 text-center text-white">Order not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black/50">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10">
          <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-playfair font-bold text-gold mb-2">Order Confirmed!</h1>
          <p className="text-gray-300 mb-6">Thank you for your order. We'll notify you when it's ready.</p>
          <div className="text-left bg-white/5 rounded-xl p-4 mb-6">
            <p><span className="text-gold">Order #:</span> {order.id}</p>
            <p><span className="text-gold">Name:</span> {order.customer_name}</p>
            <p><span className="text-gold">Total:</span> {getSymbol()}{convertPrice(order.total_amount)}</p>
            <p><span className="text-gold">Status:</span> <span className="capitalize">{order.status}</span></p>
          </div>
          <Link to="/" className="inline-block bg-gold text-black px-6 py-3 rounded-full font-semibold hover:bg-gold-light transition">Back to Home</Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;