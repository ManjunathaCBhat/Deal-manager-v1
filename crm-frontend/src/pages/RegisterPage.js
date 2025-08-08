import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../auth/auth';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './RegisterPage.css';

// Strength calculator for the colored bar + label
const calcStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const bucket = Math.min(4, Math.max(0, score - 1));
  const widths = [0, 35, 55, 78, 100];
  const labels = ['Too weak', 'Weak', 'Okay', 'Good', 'Strong'];
  const classes = ['pw-weak', 'pw-weak', 'pw-ok', 'pw-good', 'pw-strong'];

  return { percent: widths[bucket], label: labels[bucket], klass: classes[bucket] };
};

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const strength = calcStrength(form.password);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

   // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setError('Invalid email provided.');
      return;
    }

      // Password length check
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

      // Passwords match check
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({ email: form.email, password: form.password });
      setToast('Account created successfully!');
      setTimeout(() => navigate('/'), 1200);
    } catch {
      setError('Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container">
      {toast && (
        <div className={`toast ${toast ? 'show' : ''}`}>
          ✅ {toast} <span className="small">Redirecting…</span>
        </div>
      )}

      <form className="auth-box" onSubmit={handleSubmit} noValidate>
        <h2 className="welcome-title">Welcome to CRM Portal</h2>
        <img
          className="logo"
          alt="Cirrus Labs"
          src="https://www.cirruslabs.io/hubfs/Cirruslabs-Assets-20/Images/Cirruslabs-Logo%20for%20Website.jpg"
        />
        <div className="portal-title">CRM Portal</div>
        <p className="portal-subtitle">Create an Account to Manage and Protect</p>

        {/* Email */}
        <div className="input-group">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type={showPw ? 'text' : 'password'}
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          <button
            className="eye-toggle"
            type="button"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            title={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm password */}
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type={showPw2 ? 'text' : 'password'}
            name="confirm"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          <button
            className="eye-toggle"
            type="button"
            onClick={() => setShowPw2((s) => !s)}
            aria-label={showPw2 ? 'Hide password' : 'Show password'}
            title={showPw2 ? 'Hide password' : 'Show password'}
          >
            {showPw2 ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Strength bar + helper (ONLY when typing a password) */}
        {form.password ? (
          <>
            <div className="pw-meter">
              <div
                className={`pw-meter-bar ${strength.klass}`}
                style={{ width: `${strength.percent}%` }}
                aria-hidden="true"
              />
            </div>
            <p className="pw-guidance">Password strength: {strength.label}</p>
          </>
        ) : (
          <p className="pw-guidance">
            Use 8+ characters with a mix of letters, numbers & symbols.
          </p>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Signing up…' : 'Sign up'}
        </button>

        <div className="error-text" aria-live="polite">{error}</div>

        <p className="switch-text">
          Already have an account? <a href="/">Sign in</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
