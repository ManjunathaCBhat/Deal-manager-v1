// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setAuthToken } from '../auth/auth';
import { useAuth } from '../auth/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './LoginPage.css'; // imports the shared theme via @import

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login: loginContext } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);          // { username, password }
      const token = res.data.access;
      if (rememberMe) localStorage.setItem('token', token);
      loginContext(token);
      setAuthToken(token);
      navigate('/dashboard');
    } catch (_err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit} noValidate>
        <h2 className="welcome-title">Welcome to CRM Portal</h2>
        <img
          src="https://framerusercontent.com/images/advb24HpTAed7ZIqZsd5xFiJZjM.png?scale-down-to=512&width=570&height=105"
          alt="CirrusLabs"
          className="logo"
        />
        <p className="portal-subtitle">Sign in to Manage and Protect</p>

        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="text"
            name="username"
            placeholder="Your Username or Email"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            required
          />
        </div>

        <div className="input-group" style={{ position: 'relative' }}>
          <FaLock className="input-icon" />
          <input
            type={showPw ? 'text' : 'password'}
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="eye-toggle"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            title={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <FaEyeSlash /> : <FaEye />}
          </button>
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

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <div aria-live="polite" className="error-text">
          {error}
        </div>

        <p className="switch-text">
          Don’t have an account? <a href="/register">Create Account</a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;