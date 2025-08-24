import axios from 'axios';

const api = axios.create({
  // The base URL for all API requests
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;