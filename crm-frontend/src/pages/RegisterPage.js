import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../auth/auth';
import { useAuth } from '../auth/AuthContext';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import './RegisterPage.css';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      login(res.data.access); // save token to context
      navigate('/dashboard');
    } catch (err) {
      alert('❌ Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create an Account</h2>
        <p>Sign up to get started</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
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
            </div>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>

          <p className="login-text">
            Already have an account? <a href="/">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
