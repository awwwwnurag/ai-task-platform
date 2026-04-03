import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="app-container">
      <div className="glass-panel auth-form-container">
        <h2 className="text-center mb-2">Welcome Back</h2>
        <p className="text-center text-muted mb-4">Login to continue to AI Tasks</p>
        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account? <Link to="/signup" className="text-accent">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
