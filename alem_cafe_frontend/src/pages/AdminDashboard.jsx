import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      adminAPI.getAnalytics()
        .then(res => setAnalytics(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/" />;

  const stats = [
    { title: 'Total Orders', value: analytics?.total?.total || 0, icon: FiShoppingBag, color: 'text-blue-400' },
    { title: 'Revenue', value: `$${analytics?.total?.revenue || 0}`, icon: FiDollarSign, color: 'text-green-400' },
    { title: 'Today\'s Orders', value: analytics?.today?.todayOrders || 0, icon: FiTrendingUp, color: 'text-yellow-400' },
  ];

  if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading analytics...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black/50">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-playfair font-bold text-gold mb-2">Admin Dashboard</h1>
          <p className="text-gray-300 mb-8">Welcome back, {user?.name}</p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4">
                  <stat.icon className={`text-3xl ${stat.color}`} />
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-gold mb-4">Orders by Status</h2>
              {analytics?.byStatus?.map(status => (
                <div key={status.status} className="flex justify-between py-2 border-b border-white/10">
                  <span className="capitalize text-gray-300">{status.status}</span>
                  <span className="text-white font-semibold">{status.count}</span>
                </div>
              ))}
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-gold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/admin/menu" className="block text-center bg-gold/20 hover:bg-gold/30 text-gold py-2 rounded-lg transition">
  Manage Menu
</Link>
                <Link to="/admin/orders" className="block text-center bg-gold/20 hover:bg-gold/30 text-gold py-2 rounded-lg transition">
  View All Orders
</Link>
                <Link to="/admin/reservations" className="block text-center bg-gold/20 hover:bg-gold/30 text-gold py-2 rounded-lg transition">
  Manage Reservations
</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;