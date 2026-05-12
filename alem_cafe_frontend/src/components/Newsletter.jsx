import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaCoffee } from 'react-icons/fa';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const Newsletter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setMessage('');
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      await axios.post(`${API_URL}/api/newsletter`, { email });
      setStatus('success');
      setMessage(t('newsletter.success'));
      setEmail('');
      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 4000);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || t('newsletter.error'));
      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 4000);
    }
  };

  return (
    <section ref={ref} className="py-16 relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl p-8"
        >
          <div className="flex-shrink-0">
            <FaCoffee className="text-6xl text-gold" />
          </div>
          <div className="text-center md:text-left w-full">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gold">{t('newsletter.title')}</h2>
            <p className="text-gray-300 mt-2 mb-4">{t('newsletter.description')}</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-md gap-2">
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-gold/30 focus:outline-none text-white placeholder-gray-400"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-gold text-black px-6 py-3 rounded-full font-semibold hover:bg-gold-light transition disabled:opacity-50"
              >
                {status === 'loading' ? t('newsletter.subscribing') : t('newsletter.subscribe')}
              </button>
            </form>
            {message && (
              <p className={`mt-3 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;