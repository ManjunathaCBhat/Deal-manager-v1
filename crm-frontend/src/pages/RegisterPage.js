import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../auth/auth';
import { useAuth } from '../auth/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './RegisterPage.css';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      login(res.data.access);
      navigate('/dashboard');
    } catch (err) {
      alert('❌ Registration failed');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2 className="crm-title">Welcome to CRM Portal</h2>
        <img src="/logo-cirrus.png" alt="Cirrus Labs" className="cirrus-logo" />
        <h3 className="login-heading">CRM Portal</h3>
        <p className="login-subheading">Create Account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <FaEnvelope className="form-icon" />
            <input
              name="username"
              placeholder="Your Email"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <FaLock className="form-icon" />
            <input
              name="password"
              type="password"
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <FaLock className="form-icon" />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword || ''}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">Sign up</button>
        </form>

        <p className="alt-link">
          Already have an account? <a href="/">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
