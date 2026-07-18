import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session token
    const token = localStorage.getItem('session_token');
    if (token) {
      // In a real app, validate token with backend
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login logic
    const token = 'mock_token_' + Date.now();
    localStorage.setItem('session_token', token);
    setUser({ token, email });
  };

  const register = async (email, password, name) => {
    // Mock registration logic
    const token = 'mock_token_' + Date.now();
    localStorage.setItem('session_token', token);
    setUser({ token, email, name });
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
