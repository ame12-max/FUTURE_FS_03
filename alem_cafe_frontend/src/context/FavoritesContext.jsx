import { createContext, useContext, useState, useEffect } from 'react';
import { favoritesAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load favorites from localStorage for guests, from API for logged-in users
  const loadFavorites = async () => {
    if (user) {
      try {
        const res = await favoritesAPI.getFavorites();
        setFavorites(res.data);
        localStorage.setItem('favorites', JSON.stringify(res.data.map(f => f.id)));
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    } else {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const isFavorite = (menuItemId) => {
    return favorites.some(f => f.id === menuItemId);
  };

  const addFavorite = async (menuItem) => {
    if (user) {
      try {
        await favoritesAPI.addFavorite(menuItem.id);
        setFavorites(prev => [...prev, menuItem]);
        toast.success(`${menuItem.name} added to favorites`);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to add');
      }
    } else {
      const newFavorites = [...favorites, menuItem];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites.map(f => f.id)));
      toast.success(`${menuItem.name} added to favorites (Login to save permanently)`);
    }
  };

  const removeFavorite = async (menuItemId) => {
    if (user) {
      try {
        await favoritesAPI.removeFavorite(menuItemId);
        setFavorites(prev => prev.filter(f => f.id !== menuItemId));
        toast.success('Removed from favorites');
      } catch (err) {
        toast.error('Failed to remove');
      }
    } else {
      const newFavorites = favorites.filter(f => f.id !== menuItemId);
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites.map(f => f.id)));
      toast.success('Removed from favorites');
    }
  };

  const toggleFavorite = (menuItem) => {
    if (isFavorite(menuItem.id)) {
      removeFavorite(menuItem.id);
    } else {
      addFavorite(menuItem);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites, loading, isFavorite, addFavorite, removeFavorite, toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);