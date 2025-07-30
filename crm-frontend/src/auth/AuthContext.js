// src/auth/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken } from './auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
    return token ? { token } : null;
  });

  useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token);
    }
  }, [user]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
