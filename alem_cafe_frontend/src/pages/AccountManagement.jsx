import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { userAPI } from '../services/api';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiDollarSign, FiLock, FiSave, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';



const AccountManagement = () => {
  const { user } = useAuth();
  const { currency, toggleCurrency, getSymbol, exchangeRate, convertPrice } = useCurrency();
  
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { language, toggleLanguage } = useLanguage();




  useEffect(() => {
    if (user) {
      userAPI.getProfile().then(res => {
        setProfile({ name: res.data.name, email: res.data.email, phone: res.data.phone || '' });
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userAPI.updateProfile(profile);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-black/80 flex items-center justify-center">
        <div className="text-white animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-black/80">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl font-playfair font-bold text-gold mb-2">Account Settings</h1>
        <p className="text-gray-400 mb-8">Manage your profile and preferences</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-xl font-playfair font-bold text-gold mb-4 flex items-center gap-2">
              <FiUser /> Profile Information
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Full Name</label>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <FiUser className="text-gray-400" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="flex-1 bg-transparent text-white outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Email</label>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <FiMail className="text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="flex-1 bg-transparent text-white outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Phone</label>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <FiPhone className="text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="flex-1 bg-transparent text-white outline-none"
                    placeholder="+251 912 345 678"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gold text-black py-2 rounded-lg font-semibold hover:bg-gold-light transition flex items-center justify-center gap-2"
              >
                <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>

          {/* Security & Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Currency Preference */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-playfair font-bold text-gold mb-4 flex items-center gap-2">
                <FiDollarSign /> Currency Preference
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Display prices in</p>
                  <p className="text-sm text-gray-400">1 USD = {exchangeRate} ETB</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => currency !== 'ETB' && toggleCurrency()}
                    className={`px-4 py-2 rounded-lg transition ${currency === 'ETB' ? 'bg-gold text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    ETB (Br)
                  </button>
                  <button
                    onClick={() => currency !== 'USD' && toggleCurrency()}
                    className={`px-4 py-2 rounded-lg transition ${currency === 'USD' ? 'bg-gold text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-400">
                <p>Example: $10.00 = {getSymbol()}{convertPrice(10)}</p>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-playfair font-bold text-gold mb-4 flex items-center gap-2">
                <FiLock /> Change Password
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-gold border border-transparent focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-gold border border-transparent focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-gold border border-transparent focus:border-gold"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gold text-black py-2 rounded-lg font-semibold hover:bg-gold-light transition"
                >
                  {saving ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          </motion.div>
          <motion.div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
  <h2 className="text-xl font-playfair font-bold text-gold mb-4 flex items-center gap-2">
    <FiGlobe /> Language Preference
  </h2>
  <div className="flex gap-2">
    <button
      onClick={() => language !== 'en' && toggleLanguage()}
      className={`px-4 py-2 rounded-lg transition ${language === 'en' ? 'bg-gold text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
    >
      English
    </button>
    <button
      onClick={() => language !== 'am' && toggleLanguage()}
      className={`px-4 py-2 rounded-lg transition ${language === 'am' ? 'bg-gold text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
    >
      አማርኛ (Amharic)
    </button>
  </div>
</motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;