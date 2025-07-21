import axios from 'axios';

export const login = (credentials) =>
  axios.post('/api/auth/token/', credentials);  // JWT endpoint

export const register = (details) =>
  axios.post('/api/register/', details);  // Create this in your Django backend if needed

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
