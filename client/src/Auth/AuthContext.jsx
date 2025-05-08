import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const authFetch = async (url, options = {}) => {
    if (!token) {
      logout();
      throw new Error('No token found');
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }

    return response;
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
