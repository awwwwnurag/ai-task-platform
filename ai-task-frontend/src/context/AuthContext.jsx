import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'https://ai-task-backend-xt0g.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

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

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        setUser({ name, email });
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
    <AuthContext.Provider value={{ user, setUser, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
