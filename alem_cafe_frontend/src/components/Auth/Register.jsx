import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('register.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-playfair font-bold text-gold text-center mb-6">{t('register.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder={t('register.namePlaceholder')} 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition" 
            required 
          />
          <input 
            type="email" 
            placeholder={t('register.emailPlaceholder')} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition" 
            required 
          />
          <input 
            type="password" 
            placeholder={t('register.passwordPlaceholder')} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition" 
            required 
          />
          <input 
            type="password" 
            placeholder={t('register.confirmPasswordPlaceholder')} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition" 
            required 
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gold text-black py-3 rounded-full font-semibold hover:bg-gold-light transition disabled:opacity-50"
          >
            {loading ? t('register.registering') : t('register.button')}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          {t('register.haveAccount')} <Link to="/login" className="text-gold hover:underline">{t('register.loginLink')}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;