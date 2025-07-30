import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setAuthToken } from '../auth/auth';
import { useAuth } from '../auth/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './LoginPage.css';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const { login: loginContext } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const token = res.data.access;
      if (rememberMe) localStorage.setItem('token', token);
      loginContext(token);
      setAuthToken(token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2 className="welcome-title">Welcome to CRM Portal</h2>
        <img
          src="https://www.cirruslabs.io/hubfs/Cirruslabs-Assets-20/Images/Cirruslabs-Logo%20for%20Website.jpg"
          alt="Cirrus Labs"
          className="logo"
        />
        <h3 className="portal-title">CRM Portal</h3>
        <p className="portal-subtitle">Sign in to manage and protect</p>

        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="remember-me">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />{' '}
            Remember me
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Sign in
        </button>

        {error && <p className="error-text">{error}</p>}

        <p className="switch-text">
          Don’t have an account? <a href="/register">Create Account</a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
