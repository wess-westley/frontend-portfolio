// src/api/axios.js
import axios from 'axios';
import { store } from '../redux/store'; // adjust path if store.js is elsewhere

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add token if available
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 
