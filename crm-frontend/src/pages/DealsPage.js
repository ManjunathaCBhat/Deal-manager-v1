import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DealsPage.css';
import { FaBell, FaMicrophone } from 'react-icons/fa';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDeals = async () => {
    try {
      const res = await axios.get('/api/deals/');
      setDeals(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch deals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const stageClass = (stage) => {
    switch (stage.toLowerCase()) {
      case 'proposal': return 'proposal';
      case 'qualified': return 'qualified';
      case 'negotiation': return 'negotiation';
      default: return '';
    }
  };

  const stageLabel = (stage) => {
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  return (
    <div className="deals-page">
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

      <h1 className="page-title">Deals <span className="page-subtitle">Pipeline Management</span></h1>

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
              {loading ? (
                <tr><td colSpan="6">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="6">{error}</td></tr>
              ) : deals.length === 0 ? (
                <tr><td colSpan="6">No deals found.</td></tr>
              ) : (
                deals.map((deal) => (
                  <tr key={deal.id}>
                    <td>{deal.title}</td>
                    <td>{deal.company_name}</td>
                    <td>${parseFloat(deal.amount).toLocaleString()}</td>
                    <td className={`${stageClass(deal.stage)} stage-cell`}>{stageLabel(deal.stage)}</td>
                    <td>{deal.close_date}</td>
                    <td>
                      <div className="contact-info">
                        {deal.contacts.map(c => (
                          <div key={c.id} style={{ display: 'inline-flex', alignItems: 'center', marginRight: '6px' }}>
                            <img src={c.avatar_url} alt={c.name} />
                            <span style={{ marginLeft: '4px' }}>{c.name}</span>
                          </div>
                        ))}
                        {deal.contacts.length === 0 && <span>—</span>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
