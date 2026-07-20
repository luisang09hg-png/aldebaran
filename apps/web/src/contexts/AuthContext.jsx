import React, { createContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      const token = localStorage.getItem('session_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/auth/me');
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('session_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('session_token', token);
    setUser(userData);
    return response;
  };

  const register = async (email, password, name) => {
    const response = await api.post('/api/auth/register', { email, password, fullName: name });
    const { token, user: userData } = response.data;
    localStorage.setItem('session_token', token);
    setUser(userData);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('session_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
