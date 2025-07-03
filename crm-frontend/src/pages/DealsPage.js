import React from 'react';
import './DealsPage.css';
import { FaMicrophone, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const deals = [
  {
    name: 'Enterprise Software License',
    company: 'TechCorp Inc.',
    value: '$45,000',
    stage: 'Proposal',
    stageClass: 'proposal',
    closeDate: 'Dec 15, 2024',
    contact: {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/32?img=1'
    }
  },
  {
    name: 'Cloud Migration Project',
    company: 'DataFlow Solutions',
    value: '$28,500',
    stage: 'Qualified',
    stageClass: 'qualified',
    closeDate: 'Jan 30, 2025',
    contact: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/32?img=2'
    }
  },
  {
    name: 'Security Audit Package',
    company: 'SecureNet Ltd.',
    value: '$12,000',
    stage: 'Negotiation',
    stageClass: 'negotiation',
    closeDate: 'Dec 22, 2024',
    contact: {
      name: 'Mike Chen',
      avatar: 'https://i.pravatar.cc/32?img=3'
    }
  }
];

const DealsPage = () => {
  return (
    <div className="deals-page">
      {/* Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-left">CRM Project</div>
        <div className="nav-center">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/companies" className="nav-link">Companies</a>
          <a href="/customers" className="nav-link">Customers</a>
          <a href="/deals" className="nav-link active">Deals</a>
          <a href="/user-management" className="nav-link">Management</a>
          <a href="/activity-log" className="nav-link">Activity</a>
        </div>
        <div className="nav-right">
          <FaBell className="nav-icon" />
          <img src="https://i.pravatar.cc/32?img=5" alt="User" className="profile-avatar" />
        </div>
      </nav>

      {/* Page Header */}
      <h1 className="page-title">Deals <span className="page-subtitle">Pipeline Management</span></h1>

      {/* Deals Table and Voice Creator */}
      <div className="deals-layout">
        <div className="deals-table-section">
          <h3>Active Deals</h3>
          <table className="deals-table">
            <thead>
              <tr>
                <th>Deal Name</th>
                <th>Company</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Close Date</th>
                <th>Contacts</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal, index) => (
                <tr key={index} className="clickable-row">
                  <td colSpan="6">
                    <Link to="/deal-details" className="deal-row-link">
                      <div className="deal-row-content">
                        <span className="deal-cell">{deal.name}</span>
                        <span className="deal-cell">{deal.company}</span>
                        <span className="deal-cell">{deal.value}</span>
                        <span className={`deal-cell ${deal.stageClass}`}>{deal.stage}</span>
                        <span className="deal-cell">{deal.closeDate}</span>
                        <span className="deal-cell contact-info">
                          <img src={deal.contact.avatar} alt={deal.contact.name} />
                          <span>{deal.contact.name}</span>
                        </span>
                      </div>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="deals-sidebar">
          <div className="voice-deal">
            <h4><FaMicrophone /> AI Voice Deal Creator</h4>
            <p className="subtext">Speak to create deals instantly</p>
            <p className="voice-instruction">Click to start recording</p>
            <p className="voice-preview">Your spoken words will appear here...</p>
          </div>

          <div className="deal-preview">
            <h4>Deal Preview</h4>
            <div className="preview-field">
              <label>Deal Name</label>
              <p className="preview-placeholder">Auto-extracted deal name</p>
            </div>
            <div className="preview-field">
              <label>Company</label>
              <p className="preview-placeholder">Company name</p>
            </div>
            <div className="preview-field">
              <label>Deal Value</label>
              <p className="preview-placeholder">$0</p>
            </div>
            <div className="preview-field">
              <label>Close Date</label>
              <p className="preview-placeholder">Expected close date</p>
            </div>
            <div className="preview-field">
              <label>Assigned Sales Rep</label>
              <p className="preview-placeholder">—</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;