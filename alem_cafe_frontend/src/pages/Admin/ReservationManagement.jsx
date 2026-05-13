import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock as FiPending,
  FiRefreshCw,
  FiEye,
  FiEdit2,
  FiFilter,
  FiSearch
} from 'react-icons/fi';
import { reservationAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const ReservationManagement = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusConfig = {
    pending: { 
      label: t('reservation.status.pending'), 
      icon: FiPending, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-500/20',
      nextStatus: 'confirmed'
    },
    confirmed: { 
      label: t('reservation.status.confirmed'), 
      icon: FiCheckCircle, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/20',
      nextStatus: 'completed'
    },
    completed: { 
      label: t('reservation.status.completed'), 
      icon: FiCheckCircle, 
      color: 'text-green-500', 
      bg: 'bg-green-500/20',
      nextStatus: null
    },
    cancelled: { 
      label: t('reservation.status.cancelled'), 
      icon: FiXCircle, 
      color: 'text-red-500', 
      bg: 'bg-red-500/20',
      nextStatus: null
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchReservations();
    }
  }, [isAdmin]);

  const fetchReservations = async () => {
    try {
      const res = await reservationAPI.getAllAdmin();
      setReservations(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
      toast.error(t('reservation.fetchError'));
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await reservationAPI.updateStatus(id, newStatus);
      toast.success(t('reservation.statusUpdated'));
      fetchReservations();
    } catch (err) {
      toast.error(t('reservation.updateError'));
    }
  };

  const formatDisplayTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const getStatusCounts = () => {
    return {
      pending: reservations.filter(r => r.status === 'pending').length,
      confirmed: reservations.filter(r => r.status === 'confirmed').length,
      completed: reservations.filter(r => r.status === 'completed').length,
      cancelled: reservations.filter(r => r.status === 'cancelled').length,
      total: reservations.length
    };
  };

  const filteredReservations = reservations.filter(res => {
    if (filter !== 'all' && res.status !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        res.name.toLowerCase().includes(term) ||
        res.email.toLowerCase().includes(term) ||
        res.phone.includes(term) ||
        res.id.toString().includes(term)
      );
    }
    return true;
  });

  if (!isAdmin) return <Navigate to="/" />;

  const counts = getStatusCounts();

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
          <h1 className="text-3xl font-playfair font-bold text-gold">
            {t('reservation.adminTitle')}
          </h1>
          <button
            onClick={fetchReservations}
            className="bg-gold/20 text-gold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gold/30 transition"
          >
            <FiRefreshCw size={16} /> {t('common.refresh')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => setFilter('all')}>
            <p className="text-2xl font-bold text-gold">{counts.total}</p>
            <p className="text-gray-400 text-sm">{t('reservation.total')}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => setFilter('pending')}>
            <p className="text-2xl font-bold text-yellow-400">{counts.pending}</p>
            <p className="text-gray-400 text-sm">{t('reservation.status.pending')}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => setFilter('confirmed')}>
            <p className="text-2xl font-bold text-blue-400">{counts.confirmed}</p>
            <p className="text-gray-400 text-sm">{t('reservation.status.confirmed')}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => setFilter('completed')}>
            <p className="text-2xl font-bold text-green-400">{counts.completed}</p>
            <p className="text-gray-400 text-sm">{t('reservation.status.completed')}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => setFilter('cancelled')}>
            <p className="text-2xl font-bold text-red-400">{counts.cancelled}</p>
            <p className="text-gray-400 text-sm">{t('reservation.status.cancelled')}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('reservation.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition"
            />
          </div>
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl">
              <FiCalendar className="text-5xl text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">{t('reservation.noReservations')}</p>
            </div>
          ) : (
            filteredReservations.map((reservation, idx) => {
              const status = statusConfig[reservation.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  key={reservation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-gold/30 transition"
                >
                  <div className="p-4">
                    <div className="flex flex-wrap justify-between items-start gap-3">
                      {/* Left: Customer Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h3 className="text-lg font-bold text-white">{reservation.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status.bg} ${status.color} flex items-center gap-1`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                          <p className="text-gray-400">
                            <span className="text-gray-500">📧</span> {reservation.email}
                          </p>
                          <p className="text-gray-400">
                            <span className="text-gray-500">📞</span> {reservation.phone}
                          </p>
                          <p className="text-gray-400">
                            <span className="text-gray-500">📅</span> {new Date(reservation.reservation_date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-400">
                            <span className="text-gray-500">⏰</span> {formatDisplayTime(reservation.reservation_time)}
                          </p>
                          <p className="text-gray-400">
                            <span className="text-gray-500">👥</span> {reservation.guests} {reservation.guests === 1 ? t('reservation.guest') : t('reservation.guests')}
                          </p>
                          <p className="text-gray-400 col-span-full">
                            <span className="text-gray-500">📝</span> {reservation.special_requests || t('reservation.noRequests')}
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex gap-2">
                        {status.nextStatus && (
                          <button
                            onClick={() => updateStatus(reservation.id, status.nextStatus)}
                            className="px-3 py-1 rounded-full bg-gold/20 text-gold text-sm hover:bg-gold/30 transition"
                          >
                            {t(`reservation.markAs${status.nextStatus.charAt(0).toUpperCase() + status.nextStatus.slice(1)}`)}
                          </button>
                        )}
                        {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                          <button
                            onClick={() => updateStatus(reservation.id, 'cancelled')}
                            className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition"
                          >
                            {t('reservation.cancel')}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedReservation(selectedReservation === reservation.id ? null : reservation.id)}
                          className="p-2 rounded-full bg-white/10 text-gold hover:bg-white/20 transition"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedReservation === reservation.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-gold font-semibold mb-2">{t('reservation.customerInfo')}</h4>
                            <p className="text-gray-300 text-sm">ID: #{reservation.id}</p>
                            <p className="text-gray-300 text-sm">Created: {new Date(reservation.created_at).toLocaleString()}</p>
                            {reservation.user_id && (
                              <p className="text-gray-300 text-sm">User ID: {reservation.user_id}</p>
                            )}
                          </div>
                          <div>
                            <h4 className="text-gold font-semibold mb-2">{t('reservation.bookingInfo')}</h4>
                            <p className="text-gray-300 text-sm">Date: {reservation.reservation_date}</p>
                            <p className="text-gray-300 text-sm">Time: {formatDisplayTime(reservation.reservation_time)}</p>
                            <p className="text-gray-300 text-sm">Guests: {reservation.guests}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationManagement;