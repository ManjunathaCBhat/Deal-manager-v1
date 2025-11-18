import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DealsPage.css';
import { FaBell, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import DealAssistant from '../components/DealAssistant';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
      <h1 className="page-title">Deals <span className="page-subtitle">Pipeline Management</span></h1>

      <div className="deals-layout">
        <div className="deals-table-section">
          <h3>Active Deals</h3>
          <input
              type="text"
              placeholder="Search deals..."
              className="search-bar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                marginBottom: '16px',
                padding: '8px',
                width: '100%',
                maxWidth: '300px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
          />

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
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
            ) : error ? (
                <tr>
                  <td colSpan="6">{error}</td>
                </tr>
            ) : deals.length === 0 ? (
                <tr>
                  <td colSpan="6">No deals found.</td>
                </tr>
            ) : (
                deals
                  .filter(deal =>
                    deal.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((deal) => (

                    <tr key={deal.id}>
                      <td>
                        <Link to={`/deal-details/${deal.id}`} className="deal-link">
                          {deal.title}
                        </Link>
                      </td>

                      <td>{deal.company_name}</td>
                      <td>${parseFloat(deal.amount).toLocaleString()}</td>
                      <td className={`${stageClass(deal.stage)} stage-cell`}>{stageLabel(deal.stage)}</td>
                      <td>{deal.close_date}</td>
                      <td>
                        <div className="deal-contact-info">
                          {deal.contacts.map(c => (
                              <div key={c.id} className="deal-contact">
                                <img src={c.avatar_url} alt={c.name} className="contact-avatar"/>
                                <div className="contact-details">
                                  <span className="contact-name">{c.name}</span>
                                  <div className="contact-icons">
                                    {c.email && (
                                        <a href={`mailto:${c.email}`} title={`Email ${c.name}`}>
                                          <FaEnvelope/>
                                        </a>
                                    )}
                                    {c.phone_number && (
                                        <a href={`tel:${c.phone_number}`} title={`Call ${c.name}`}>
                                          <FaPhone/>
                                        </a>
                                    )}
                                  </div>
                                </div>
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
          <DealAssistant/>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;