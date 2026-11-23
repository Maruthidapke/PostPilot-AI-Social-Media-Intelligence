import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'usr_demo_p59_001',
    name: 'Maruthi Dapke',
    email: 'demo@postpilot.ai',
    role: 'manager',
    timezone: 'Asia/Kolkata'
  });
  const [token, setToken] = useState(localStorage.getItem('postpilot_token') || 'demo_token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existingToken = localStorage.getItem('postpilot_token');
    if (existingToken) {
      api.getMe()
        .then(res => {
          if (res.success && res.user) {
            setUser(res.user);
          }
        })
        .catch(() => {
          // Keep default demo user
        });
    }
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('postpilot_token', res.token);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (data) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('postpilot_token', res.token);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('postpilot_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login: loginUser, register: registerUser, logout: logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
