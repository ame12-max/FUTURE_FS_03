import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '../services/api';

const CurrencyContext = createContext();

// ETB to USD conversion rate
const EXCHANGE_RATE = 160; // 1 USD = 160 ETB

export const CurrencyProvider = ({ children }) => {
  const { user } = useAuth();
  const [currency, setCurrency] = useState('ETB');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrency = async () => {
      if (user) {
        try {
          const res = await userAPI.getProfile();
          setCurrency(res.data.preferred_currency || 'ETB');
        } catch (err) {
          console.error('Failed to load currency:', err);
          setCurrency('ETB');
        }
      } else {
        const saved = localStorage.getItem('preferred_currency');
        setCurrency(saved || 'ETB');
      }
      setLoading(false);
    };
    loadCurrency();
  }, [user]);

  const convertPrice = (priceUSD) => {
    const numPrice = typeof priceUSD === 'string' ? parseFloat(priceUSD) : priceUSD;
    if (currency === 'ETB') {
      return (numPrice * EXCHANGE_RATE).toFixed(2);
    }
    return numPrice.toFixed(2);
  };

  const getSymbol = () => {
    return currency === 'ETB' ? 'Br' : '$';
  };

  const toggleCurrency = async () => {
    const newCurrency = currency === 'USD' ? 'ETB' : 'USD';
    setCurrency(newCurrency);
    
    if (user) {
      try {
        await userAPI.updateProfile({ preferred_currency: newCurrency });
      } catch (err) {
        console.error('Failed to save currency preference:', err);
      }
    } else {
      localStorage.setItem('preferred_currency', newCurrency);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, convertPrice, getSymbol, toggleCurrency, loading, exchangeRate: EXCHANGE_RATE }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);