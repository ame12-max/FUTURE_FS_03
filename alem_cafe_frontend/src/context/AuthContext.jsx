import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      authAPI.getMe()
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    // Make sure we set the user with preferences from response
    setUser({
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
      preferred_currency: res.data.user.preferred_currency || 'ETB',
      preferred_language: res.data.user.preferred_language || 'en'
    });
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser({
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
      preferred_currency: res.data.user.preferred_currency || 'ETB',
      preferred_language: res.data.user.preferred_language || 'en'
    });
    return res.data;
  };

const getMe = async () => {
  try {
    const res = await authAPI.getMe();
    setUser(res.data);
    return res.data;
  } catch (err) {
    console.error('Failed to get user:', err);
    return null;
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      updateUser,
      getMe,
      isAdmin: user?.role === 'admin' || user?.role === 'manager' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);