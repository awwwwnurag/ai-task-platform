import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import MyAccount from './pages/MyAccount';
import Settings from './pages/Settings';

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" />} />
      
      <Route element={token ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
