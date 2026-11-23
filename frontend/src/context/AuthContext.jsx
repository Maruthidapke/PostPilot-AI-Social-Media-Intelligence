import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('postpilot_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingToken = localStorage.getItem('postpilot_token');
    if (existingToken) {
      api.getMe()
        .then(res => {
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logoutUser();
          }
        })
        .catch(() => {
          logoutUser();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
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

  const loginAsDemo = async () => {
    // 1-click login for evaluation and review
    return loginUser('demo@postpilot.ai', 'password123');
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

  const updateUserProfile = async (updates) => {
    try {
      const res = await api.updateProfile(updates);
      if (res.success) {
        setUser(prev => ({ ...prev, ...res.user }));
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login: loginUser,
      loginAsDemo,
      register: registerUser,
      logout: logoutUser,
      updateProfile: updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
