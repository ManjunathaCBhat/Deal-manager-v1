import React, { useEffect, useState } from 'react';
import './ActivityLogPage.css';
import { FaFilter, FaDownload, FaBell } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 20;

const mapActionType = (action) => {
  if (action === "Addition") return "Create";
  if (action === "Change") return "Edit";
  if (action === "Deletion") return "Delete";
  return action;
};

const ActivityLogPage = () => {
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    fetch('/api/activity-log/')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error('Error loading activity log:', err));
  }, []);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentActivities = activities.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="activity-log-container">
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
          <a href="/user-management" className="nav-link">Management</a>
          <a href="/activity-log" className="nav-link active">Activity</a>
        </div>
        <div className="nav-right">
          <FaBell className="nav-icon" />
          <img
            src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            alt="Default Avatar"
            className="profile-avatar"
          />
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </nav>

      <div className="activity-log-header">
        <h1>Activity Log</h1>
        <div className="activity-actions">
          <button><FaFilter size={14} /> Filter</button>
          <button><FaDownload size={14} /> Export</button>
        </div>
      </div>

      <div className="activity-log-subtitle">
        Track all system activities and user actions
      </div>

      <div className="activity-table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {currentActivities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.model ? activity.model.charAt(0).toUpperCase() + activity.model.slice(1) : '—'}</td>
                <td>
                  <div className="activity-user">
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                      alt="Default Avatar"
                      className="default-avatar"
                    />
                    <span>{activity.user || '—'}</span>
                  </div>
                </td>
                <td>
                  <span className={`action-${mapActionType(activity.action_type || '').toLowerCase()}`}>
                    {mapActionType(activity.action_type || '')}
                  </span>
                </td>
                <td>{activity.object_repr || '—'}</td>
                <td>{activity.action_time || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="activity-table-pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
        <span className="current-page">{currentPage}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default ActivityLogPage;
