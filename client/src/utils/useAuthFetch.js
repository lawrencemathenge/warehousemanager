import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useCallback } from 'react';

export const useAuthFetch = () => {
  const navigate = useNavigate();

  const authFetch = useCallback(async (url, options = {}) => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      throw new Error('No token found');
    }

    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Token expired');
      }
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
      throw err;
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
      throw new Error('Unauthorized');
    }

    return response;
  }, [navigate]);

  return authFetch;
};


