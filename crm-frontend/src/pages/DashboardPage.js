import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import {
  FaHandshake,
  FaBuilding,
  FaUserPlus,
  FaDollarSign,
  FaBell,
  FaUserCircle,
  FaEdit,
  FaEye,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';

function DashboardPage() {
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dealRes = await axios.get('/api/deals/');
        const customerRes = await axios.get('/api/customers/');
        setDeals(dealRes.data);
        setCustomers(customerRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalDeals = deals.length;
  const totalCompanies = new Set(deals.map((d) => d.company_name)).size;
  const totalContacts = customers.length;
  const pipelineValue = deals.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  const stageColor = (stage) => {
    switch (stage.toLowerCase()) {
      case 'proposal': return 'blue';
      case 'negotiation': return 'orange';
      case 'qualified': return 'red';
      case 'closing': return 'green';
      case 'discovery': return 'purple';
      default: return '';
    }
  };

  const stageLabel = (stage) => {
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };
  const formatPhoneNumber = (phone) => {
    if (!phone) return '-';
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
  };

  const { logout } = useAuth();
const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate('/');
};

  return (
      <div className="dashboard-page">
        {/* Navigation Bar */}
        <nav className="top-nav">
          <div className="nav-left">CRM Project</div>
          <div className="nav-center">
            <a href="/dashboard" className="nav-link active">Dashboard</a>
            <a href="/companies" className="nav-link ">Companies</a>
            <a href="/customers" className="nav-link">Customers</a>
            <a href="/deals" className="nav-link">Deals</a>
            <a href="/user-management" className="nav-link">Management</a>
            <a href="/activity-log" className="nav-link">Activity</a>
          </div>
          <div className="nav-right">
            <FaBell className="nav-icon"/>
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


        {/* Header */}
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Manage and track your sales opportunities</p>

        {/* KPIs */}
        <div className="kpi-grid">
          <KpiCard icon={<FaHandshake/>} value={totalDeals} label="Total Deals"/>
          <KpiCard icon={<FaBuilding/>} value={totalCompanies} label="Active Companies"/>
          <KpiCard icon={<FaUserPlus/>} value={totalContacts} label="New Contacts"/>
          <KpiCard icon={<FaDollarSign/>} value={`$${pipelineValue.toLocaleString()}`} label="Pipeline Value"/>
        </div>

        {/* Active Deals */}
        <div className="section-header">
          <h3>Active Deals</h3>
          <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            <a href="/deals" className="view-all-link">View All</a>
          </div>
        </div>

        <table className="deals-table">
          <thead>
          <tr>
            <th>Deal Name</th>
            <th>Company</th>
            <th>Deal Value</th>
            <th>Stage</th>
            <th>Contacts</th>
            <th>Close Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {loading ? (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
          ) : deals.length === 0 ? (
              <tr>
                <td colSpan="7">No deals available.</td>
              </tr>
          ) : (
              deals.slice(0, 6).map((deal) => (
                  <tr key={deal.id}>
                    <td>{deal.title}</td>
                    <td>{deal.company_name}</td>
                    <td>${parseFloat(deal.amount).toLocaleString()}</td>
                    <td className={`stage ${stageColor(deal.stage)}`}>{stageLabel(deal.stage)}</td>
                    <td>
                      {deal.contacts.length > 0 ? deal.contacts.map(c => (
                          <div key={c.id} style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                            <img src={c.avatar_url} alt={c.name} style={{width: 24, height: 24, borderRadius: '50%'}}/>
                            {c.name}
                          </div>
                      )) : '—'}
                    </td>
                    <td>{deal.close_date || '—'}</td>
                    <td className="action-icon">
                      <Link to={`/deal-details/${deal.id}`}>
                        <FaEye style={{cursor: 'pointer'}}/>
                      </Link>
                    </td>

                  </tr>
              ))
          )}
          </tbody>
        </table>

        {/* Recent Customers */}
        <div className="recent-customers">
          <div className="recent-header">
            <h3>Recent Customers</h3>
            <a href="/customers">View All</a>
          </div>
          {customers.slice(0, 4).map((c) => (
              <div key={c.id} className="customer-row">
                <div className="customer-left">
                  <img
                      src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                      alt="Default Avatar"
                      className="default-avatar"
                  />
                  <div className="customer-info">
                    <strong>{c.name}</strong>
                    <p>
                      <FaEnvelope className="icon"/> {c.email}&nbsp;&nbsp;&nbsp;&nbsp;
                      <FaPhone className="icon"/> {formatPhoneNumber(c.phone_number)}
                    </p>
                  </div>
                </div>
                <span className="customer-amount">New Contact</span>
              </div>
          ))}
        </div>
      </div>
  );
}

function KpiCard({icon, value, label, growth}) {
  return (
      <div className="kpi-card">
        <div className="icon">{icon}</div>
        <div>
          <h3>{value}</h3>
          <p>{label}</p>
          <span>{growth}</span>
        </div>
      </div>
  );
}

export default DashboardPage;
