import React from 'react';
import './ActivityLogPage.css';
import { FaFilter, FaDownload } from 'react-icons/fa';

const activities = [
  {
    typeIcon: '🟢',
    type: 'Created Customer',
    userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    userName: 'John Smith',
    action: 'CREATE',
    actionClass: 'action-create',
    target: 'Customer "John Doe"',
    time: 'Today at 3:32 PM'
  },
  {
    typeIcon: '🔧',
    type: 'Updated Deal',
    userImage: 'https://randomuser.me/api/portraits/men/2.jpg',
    userName: 'Alex Rodriguez',
    action: 'UPDATE',
    actionClass: 'action-update',
    target: 'Deal "#4312 – Website Redesign"',
    time: 'Today at 2:08 PM'
  },
  {
    typeIcon: '🗑️',
    type: 'Deleted Company',
    userImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    userName: 'Mike Davis',
    action: 'DELETE',
    actionClass: 'action-delete',
    target: 'Company "GreenTech Ltd."',
    time: 'Yesterday at 6:10 PM'
  },
  {
    typeIcon: '👁️',
    type: 'Viewed Report',
    userImage: 'https://randomuser.me/api/portraits/men/4.jpg',
    userName: 'Mike Chen',
    action: 'VIEW',
    actionClass: 'action-view',
    target: 'Report "Q2 Pipeline Summary"',
    time: 'June 22, 2025 – 10:45 AM'
  },
  {
    typeIcon: '🟢',
    type: 'Created Company',
    userImage: 'https://randomuser.me/api/portraits/men/5.jpg',
    userName: 'Jake Crittens',
    action: 'CREATE',
    actionClass: 'action-create',
    target: 'Company "Tesla Inc."',
    time: 'June 22, 2025 – 9:15 AM'
  },
];

const ActivityLogPage = () => {
  return (
    <div className="activity-log-container">
      {/* Top Header */}
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

      {/* Table */}
      <div className="activity-table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={index}>
                <td>
                  <div className="activity-type">
                    <span className="activity-icon">{activity.typeIcon}</span>
                    <span>{activity.type}</span>
                  </div>
                </td>
                <td>
                  <div className="activity-user">
                    <img src={activity.userImage} alt={activity.userName} />
                    <span>{activity.userName}</span>
                  </div>
                </td>
                <td>
                  <span className={activity.actionClass}>{activity.action}</span>
                </td>
                <td>
                  <span className="target-text">{activity.target}</span>
                </td>
                <td>
                  <span className="date-time">{activity.time}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="activity-table-pagination">
        <span>Previous</span>
        <span>1</span>
        <span className="current-page">2</span>
        <span>3</span>
        <span>Next</span>
      </div>
    </div>
  );
};

export default ActivityLogPage;
