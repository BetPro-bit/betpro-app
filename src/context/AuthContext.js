import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { restoreSession(); }, []);

  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const phone = await AsyncStorage.getItem('user_phone');
      const bal   = await AsyncStorage.getItem('user_balance');
      if (token && phone) {
        setUser({ phone, token });
        setBalance(parseFloat(bal) || 0);
      }
    } catch (e) {}
    finally { setLoading(false); }
  };

  const login = async (phone, password) => {
    const data = await authAPI.login(phone, password);
    setUser({ phone, token: data.token });
    setBalance(data.user?.balance || 0);
    await AsyncStorage.setItem('user_balance', String(data.user?.balance || 0));
    return data;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setBalance(0);
  };

  const updateBalance = async (newBalance) => {
    setBalance(newBalance);
    await AsyncStorage.setItem('user_balance', String(newBalance));
  };

  return (
    <AuthContext.Provider value={{ user, balance, loading, login, logout, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);