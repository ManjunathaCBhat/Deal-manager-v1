import React, { useState } from 'react';
import './LoginPage.css';
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaEye } from 'react-icons/fa';
import { login, setAuthToken } from '../auth/auth';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login: loginContext } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const token = res.data.access;
      loginContext(token);
      setAuthToken(token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome back</h2>
        <p>Sign in to your account to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <FaEye className="input-icon eye-icon" />
            </div>
          </div>

          <div className="options-row">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/">Forgot password?</a>
          </div>

          <button type="submit" className="sign-in-btn">Sign in</button>
          {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}

          <div className="divider">or</div>

          <div className="social-buttons">
            <button type="button" className="social-btn">
              <FaGoogle className="social-icon google" /> Google
            </button>
            <button type="button" className="social-btn">
              <FaGithub className="social-icon github" /> GitHub
            </button>
          </div>

          <p className="signup-text">
            Don’t have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
