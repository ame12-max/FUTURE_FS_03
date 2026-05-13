import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiClock, FiUsers, FiPhone, FiMail, FiUser, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { reservationAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ReservationModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // Convert time to 24-hour format
    const convertTo24Hour = (timeStr) => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return timeStr;
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const period = match[3].toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
    };
    
    const submissionData = {
      ...formData,
      time: convertTo24Hour(formData.time)
    };
    
    await reservationAPI.create(submissionData);
    setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: '',
          date: '',
          time: '',
          guests: 2,
          specialRequests: ''
        });
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || t('reservation.error'));
    } finally {
      setLoading(false);
    }
  };

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Generate time slots (10 AM to 10 PM)
  const timeSlots = [];
  for (let i = 10; i <= 22; i++) {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    timeSlots.push(`${hour}:00 ${ampm}`);
    timeSlots.push(`${hour}:30 ${ampm}`);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-gradient-to-br from-black/95 to-black/90 backdrop-blur-xl rounded-2xl w-full max-w-md p-6 border border-gold/30 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
            >
              <FiX size={24} />
            </button>

            {/* Success State */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
                >
                  <FiCheckCircle className="text-5xl text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-playfair font-bold text-gold mb-2">
                  {t('reservation.successTitle')}
                </h3>
                <p className="text-gray-300 text-center">
                  {t('reservation.successMessage')}
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiCalendar className="text-3xl text-gold" />
                  </div>
                  <h2 className="text-2xl font-playfair font-bold text-gold">
                    {t('reservation.title')}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {t('reservation.subtitle')}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 text-xs mb-1 flex items-center gap-1">
                        <FiUser size={12} /> {t('reservation.name')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs mb-1 flex items-center gap-1">
                        <FiMail size={12} /> {t('reservation.email')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 text-xs mb-1 flex items-center gap-1">
                        <FiPhone size={12} /> {t('reservation.phone')}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+251 912 345 678"
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs mb-1 flex items-center gap-1">
                        <FiUsers size={12} /> {t('reservation.guests')}
                      </label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 text-xs mb-1 flex items-center gap-1">
                        <FiCalendar size={12} /> {t('reservation.date')}
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={today}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs mb-1 flex items-center gap-1">
                        <FiClock size={12} /> {t('reservation.time')}
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-gold transition"
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-xs mb-1 flex items-center gap-1">
                      <FiMessageSquare size={12} /> {t('reservation.specialRequests')}
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows="2"
                      placeholder={t('reservation.requestsPlaceholder')}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-gold to-yellow-600 text-black py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100 mt-4 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('reservation.submitting')}
                      </>
                    ) : (
                      t('reservation.submit')
                    )}
                  </button>
                </form>

                {/* Footer Note */}
                <p className="text-center text-gray-500 text-xs mt-4">
                  {t('reservation.footerNote')}
                </p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReservationModal;