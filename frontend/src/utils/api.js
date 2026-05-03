import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — normalise errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// ─── API Calls ────────────────────────────────────────────────────────────────

export const registerWebinar = (data) => api.post('/webinar/register', data);

export const submitTest = (data) => api.post('/test/submit', data);

export const createPaymentOrder = (data) => api.post('/payment/create-order', data);

export const verifyPayment = (data) => api.post('/payment/verify', data);

export const bookCounselling = (data) => api.post('/counselling/book', data);

export default api;
