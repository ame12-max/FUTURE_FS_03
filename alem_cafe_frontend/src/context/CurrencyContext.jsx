import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '../services/api';

const CurrencyContext = createContext();

// Exchange rate: 1 USD = ? ETB (you can update this from an API later)
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

  // Convert price from ETB (database) to selected currency
  const convertPrice = (priceETB) => {
    const numPrice = typeof priceETB === 'string' ? parseFloat(priceETB) : priceETB;
    if (currency === 'USD') {
      // Convert ETB to USD
      return (numPrice / EXCHANGE_RATE).toFixed(2);
    }
    // Return ETB as is
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
    <CurrencyContext.Provider value={{ 
      currency, 
      convertPrice, 
      getSymbol, 
      toggleCurrency, 
      loading, 
      exchangeRate: EXCHANGE_RATE 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);