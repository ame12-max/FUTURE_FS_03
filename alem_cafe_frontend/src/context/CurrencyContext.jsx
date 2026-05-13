import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '../services/api';

const CurrencyContext = createContext();

const EXCHANGE_RATE = 160;

export const CurrencyProvider = ({ children }) => {
  const { user, getMe } = useAuth();
  const [currency, setCurrency] = useState('ETB');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrency = async () => {
      if (user) {
        setCurrency(user.preferred_currency || 'ETB');
      } else {
        const saved = localStorage.getItem('preferred_currency');
        setCurrency(saved || 'ETB');
      }
      setLoading(false);
    };
    loadCurrency();
  }, [user]);

  const convertPrice = (priceETB) => {
    const numPrice = typeof priceETB === 'string' ? parseFloat(priceETB) : priceETB;
    if (currency === 'USD') {
      return (numPrice / EXCHANGE_RATE).toFixed(2);
    }
    return numPrice.toFixed(2);
  };

  const getSymbol = () => {
    return currency === 'ETB' ? 'Br ' : '$ ';
  };

  const toggleCurrency = async () => {
    const newCurrency = currency === 'USD' ? 'ETB' : 'USD';
    
    if (user) {
      try {
        // Optimistically update UI
        setCurrency(newCurrency);
        
        // Save to backend
        await userAPI.updateProfile({ preferred_currency: newCurrency });
        
        // Refresh user data to confirm
        const updatedUser = await getMe();
        if (updatedUser && updatedUser.preferred_currency) {
          setCurrency(updatedUser.preferred_currency);
        }
      } catch (err) {
        console.error('Failed to save currency preference:', err);
        // Revert on error
        setCurrency(currency);
      }
    } else {
      setCurrency(newCurrency);
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