import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        setUser({ email }); 
        navigate('/dashboard');
      } else {
        alert('Login failed: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Login Error: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const signup = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        setUser({ email });
        navigate('/dashboard');
      } else {
        alert('Signup failed: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Signup Error: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
