import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '../services/api';
import enTranslations from '../locales/en.json';
import amTranslations from '../locales/am.json';

const translations = {
  en: enTranslations,
  am: amTranslations
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { user, getMe } = useAuth();
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      if (user) {
        setLanguage(user.preferred_language || 'en');
      } else {
        const saved = localStorage.getItem('preferred_language');
        setLanguage(saved || 'en');
      }
      setLoading(false);
    };
    loadLanguage();
  }, [user]);

  const t = (key, variables = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }
    if (typeof value === 'object') return key;
    let result = value;
    Object.keys(variables).forEach(varKey => {
      result = result.replace(`{${varKey}}`, variables[varKey]);
    });
    return result;
  };

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'am' : 'en';
    
    if (user) {
      try {
        // Optimistically update UI
        setLanguage(newLanguage);
        
        // Save to backend
        await userAPI.updateProfile({ preferred_language: newLanguage });
        
        // Refresh user data to confirm
        const updatedUser = await getMe();
        if (updatedUser && updatedUser.preferred_language) {
          setLanguage(updatedUser.preferred_language);
        }
      } catch (err) {
        console.error('Failed to save language preference:', err);
        // Revert on error
        setLanguage(language);
      }
    } else {
      setLanguage(newLanguage);
      localStorage.setItem('preferred_language', newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);