import React from 'react';
import './UserManagementPage.css';
import { FaEdit, FaTrash, FaUserSlash, FaBell } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const users = [
  {
    name: 'Ayaan Shekhani',
    email: 'ayaan@crm.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Today at 2:00 PM',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
  },
  {
    name: 'Fatima Noor',
    email: 'fatima.noor@crm.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: 'June 22, 2025 – 4:18 PM',
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg'
  },
  {
    name: 'Blake Johnston',
    email: 'blake@crm.com',
    role: 'User',
    status: 'Active',
    lastLogin: 'Yesterday at 10:30 AM',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg'
  }
];

const UserManagementPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="user-management-page">
      {/* Nav Bar */}
      <nav className="top-nav">
        <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="https://www.cirruslabs.io/hubfs/Cirruslabs-Assets-20/Images/Cirruslabs-Logo%20for%20Website.jpg"
            alt="Cirrus Labs"
            style={{ height: '75px', borderRadius: '3px' }}
          />
          <span style={{ fontWeight: 600, fontSize: '24px', color: '#111827' }}>CRM Portal</span>
        </div>
        <div className="nav-center">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/companies" className="nav-link">Companies</a>
          <a href="/customers" className="nav-link">Customers</a>
          <a href="/deals" className="nav-link">Deals</a>
          <a href="/user-management" className="nav-link active">Management</a>
          <a href="/activity-log" className="nav-link">Activity</a>
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

      {/* Page Header */}
      <div className="user-header">
        <h1>User Management</h1>
        <button className="add-user-btn">➕ Add User</button>
      </div>

      {/* Filters */}
      <div className="user-filters">
        <select>
          <option>All Roles</option>
          <option>Admin</option>
          <option>User</option>
        </select>
        <select>
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <input type="text" placeholder="Search by name or email" />
      </div>

      {/* Table */}
      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td className="user-name">
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td className="user-actions">
                  <FaEdit title="Edit" />
                  <FaTrash title="Delete" />
                  <FaUserSlash title="Deactivate" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
