import React from 'react';
import './LoginPage.css';
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaEye } from 'react-icons/fa';

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome back</h2>
        <p>Sign in to your account to continue</p>

        <form>
          <div className="input-group">
            <label>Email address</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input type="email" placeholder="Enter your email" />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input type="password" placeholder="Enter your password" />
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
            Don’t have an account? <a href="/">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;