import React from "react";
import { FaBell } from "react-icons/fa";
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // Your CSS for Navbar

const NavBar = ({ activePage }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <img
          src="https://framerusercontent.com/images/advb24HpTAed7ZIqZsd5xFiJZjM.png?scale-down-to=512&width=570&height=105"
          alt="CirrusLabs"
          className="logo"
        />
        <span className="portal-title">CRM Portal</span>
      </div>
      <div className="nav-center">
        <a href="/dashboard" className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}>Dashboard</a>
        <a href="/companies" className={`nav-link ${activePage === 'companies' ? 'active' : ''}`}>Companies</a>
        <a href="/customers" className={`nav-link ${activePage === 'customers' ? 'active' : ''}`}>Customers</a>
        <a href="/deals" className={`nav-link ${activePage === 'deals' ? 'active' : ''}`}>Deals</a>
        <a href="/user-management" className={`nav-link ${activePage === 'user-management' ? 'active' : ''}`}>Management</a>
        <a href="/activity-log" className={`nav-link ${activePage === 'activity-log' ? 'active' : ''}`}>Activity</a>
      </div>
      <div className="nav-right">
        <FaBell className="nav-icon" />
        <img
          src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
          alt="Default Avatar"
          className="profile-avatar"
        />
        <button className="logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
