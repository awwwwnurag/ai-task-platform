import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

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
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser({ email }); 
      navigate('/dashboard');
    }
  };

  const signup = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser({ email });
      navigate('/dashboard');
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
