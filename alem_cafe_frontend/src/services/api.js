import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const menuAPI = {
  getAll: () => api.get('/menu'),
  getOne: (id) => api.get(`/menu/${id}`),
  getReviews: (id) => api.get(`/menu/${id}/reviews`),
  addReview: (id, data) => api.post(`/menu/${id}/reviews`, data),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getByEmail: (email) => api.get(`/orders/search/by-email?email=${email}`),
  getById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

export const adminAPI = {
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getAnalytics: () => api.get('/admin/analytics'),
  getMenuItems: () => api.get('/admin/menu'),
  addMenuItem: (data) => api.post('/admin/menu', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMenuItem: (id, data) => api.put(`/admin/menu/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMenuItem: (id) => api.delete(`/admin/menu/${id}`),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter', { email }),
};

export const reservationAPI = {
  create: (data) => api.post('/reservations', data),
};
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateQuantity: (data) => api.put('/cart/update', data),
  removeFromCart: (menuItemId) => api.delete(`/cart/remove/${menuItemId}`),
  clearCart: () => api.delete('/cart/clear'),
  syncCart: (localCart) => api.post('/cart/sync', { localCart }),
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If it's already a full URL (http:// or https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // If it's a local path starting with /uploads/
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE}${imagePath}`;
  }
  // If it's just a filename or other format
  return `${API_BASE}/uploads/${imagePath}`;
};



export default api;