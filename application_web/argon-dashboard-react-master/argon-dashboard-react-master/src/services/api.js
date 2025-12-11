import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
  
  signup: (username, email, password, role = 'user') => 
    api.post('/auth/signup', { username, email, password, role }),
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  
  create: (event) => api.post('/events', event),
  
  update: (id, event) => api.put(`/events/${id}`, event),
  
  delete: (id) => api.delete(`/events/${id}`),
};

// Sync API
export const syncAPI = {
  push: () => api.post('/sync/push'),
  
  pull: () => api.post('/sync/pull'),
};

// Logs API
export const logsAPI = {
  getAll: () => api.get('/logs'),
};

export default api;
