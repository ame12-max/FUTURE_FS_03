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
  const { user } = useAuth();
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      if (user) {
        try {
          const res = await userAPI.getProfile();
          setLanguage(res.data.preferred_language || 'en');
        } catch (err) {
          console.error('Failed to load language:', err);
          setLanguage('en');
        }
      } else {
        const saved = localStorage.getItem('preferred_language');
        setLanguage(saved || 'en');
      }
      setLoading(false);
    };
    loadLanguage();
  }, [user]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // fallback to key if translation missing
      }
    }
    return value;
  };

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'am' : 'en';
    setLanguage(newLanguage);
    
    if (user) {
      try {
        await userAPI.updateProfile({ preferred_language: newLanguage });
      } catch (err) {
        console.error('Failed to save language preference:', err);
      }
    } else {
      localStorage.setItem('preferred_language', newLanguage);
    }
  };

  const setLanguageDirect = async (lang) => {
    if (lang !== 'en' && lang !== 'am') return;
    setLanguage(lang);
    
    if (user) {
      try {
        await userAPI.updateProfile({ preferred_language: lang });
      } catch (err) {
        console.error('Failed to save language preference:', err);
      }
    } else {
      localStorage.setItem('preferred_language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguageDirect, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);