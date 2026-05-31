import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import GoogleLoginButton from './GoogleLoginButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('login.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/80 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/20"
      >
        <h2 className="text-3xl font-playfair font-bold text-gold text-center mb-6">
          {t('login.title')}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder={t('login.emailPlaceholder')} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition" 
            required 
          />
          <input 
            type="password" 
            placeholder={t('login.passwordPlaceholder')} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold transition" 
            required 
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gold text-black py-3 rounded-full font-semibold hover:bg-gold-light transition disabled:opacity-50"
          >
            {loading ? t('login.loggingIn') : t('login.button')}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-black/80 px-2 text-gray-400">
              {t('login.orContinueWith') || 'Or continue with'}
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <GoogleLoginButton />

        <p className="text-center text-gray-400 mt-6">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="text-gold hover:underline">
            {t('login.registerLink')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;