import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/theme';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('jwt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: async (phone, password) => {
    const res = await api.post('/api/auth/login', { phone, password });
    await AsyncStorage.setItem('jwt_token', res.data.token);
    await AsyncStorage.setItem('user_phone', phone);
    await AsyncStorage.setItem('user_balance', String(res.data.user?.balance || 0));
    return res.data;
  },

  register: async (phone, password) => {
    const res = await api.post('/api/auth/register', { phone, password });
    return res.data;
  },

  verifyOTP: async (phone, otp) => {
    const res = await api.post('/api/auth/verify-otp', { phone, otp });
    return res.data;
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['jwt_token', 'user_phone', 'user_balance']);
  },
};

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentsAPI = {
  deposit: async (phone, amount) => {
    try {
      const res = await api.post('/api/payments/stkpush', {
        phone: '254' + phone.replace(/^0/, ''),
        amount: parseInt(amount),
        accountReference: 'BETPRO-DEP',
        transactionDesc: 'BetPro Deposit',
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Deposit failed');
    }
  },

  checkStatus: async (checkoutRequestId) => {
    try {
      const res = await api.get(`/api/payments/${checkoutRequestId}`);
      return res.data;
    } catch (err) {
      throw new Error('Failed to check payment status');
    }
  },

  withdraw: async (phone, amount) => {
    try {
      const res = await api.post('/api/payments/withdraw', {
        phone: '254' + phone.replace(/^0/, ''),
        amount: parseInt(amount),
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Withdrawal failed');
    }
  },

  getHistory: async (page = 1, limit = 20) => {
    try {
      const res = await api.get(`/api/payments?page=${page}&limit=${limit}`);
      return res.data;
    } catch (err) {
      throw new Error('Failed to fetch payment history');
    }
  },
};

export default api;