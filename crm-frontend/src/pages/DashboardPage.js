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

  // Example growth data, replace with real API if available
  const growthData = {
    contacts: '+12.5%',
    companies: '+8.2%',
    deals: '+15.3%',
    revenue: '+23.1%'
  };

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
    <div className="dashboard-layout" style={{ display: 'flex', height: '100vh' }}>
      <main className="dashboard-main" style={{ flex: 1, background: '#f9fafb', padding: '2rem', overflowY: 'auto' }}>
        {/* KPI Cards - Modern Style */}
        <div className="kpi-grid">
          <KpiCard
            icon={<FaUserPlus size={32} />}
            value={totalContacts}
            label="Total Contacts"
            growth={growthData.contacts}
            color="#2563eb"
            bgColor="rgba(37,99,235,0.08)"
          />
          <KpiCard
            icon={<FaBuilding size={32} />}
            value={totalCompanies}
            label="Companies"
            growth={growthData.companies}
            color="#22c55e"
            bgColor="rgba(34,197,94,0.08)"
          />
          <KpiCard
            icon={<FaHandshake size={32} />}
            value={totalDeals}
            label="Active Deals"
            growth={growthData.deals}
            color="#a855f7"
            bgColor="rgba(168,85,247,0.08)"
          />
          <KpiCard
            icon={<FaDollarSign size={32} />}
            value={`$${pipelineValue.toLocaleString()}`}
            label="Revenue"
            growth={growthData.revenue}
            color="#f59e0b"
            bgColor="rgba(245,158,11,0.08)"
          />
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
                      <FaEnvelope className="icon"/>
                      <a
                        href={`mailto:${c.email}`}
                        className="contact-link"
                      >
                        {c.email}
                      </a>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <FaPhone className="icon"/>
                      <a
                        href={`tel:${c.phone_number}`}
                        className="contact-link"
                      >
                        {formatPhoneNumber(c.phone_number)}
                      </a>
                    </p>
                  </div>
                </div>
                <span className="customer-amount">New Contact</span>
              </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function KpiCard({icon, value, label, growth, color, bgColor}) {
  return (
    <div className="kpi-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 24, borderRadius: 16, background: '#fff', boxShadow: '0 2px 8px rgba(30,58,138,0.04)', minHeight: 140 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 500, fontSize: 16 }}>{label}</div>
        <div style={{ background: bgColor, borderRadius: 12, padding: 8 }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, margin: '16px 0 0 0', color: '#111827' }}>{value}</div>
      <div style={{ fontSize: 14, color: '#16a34a', marginTop: 8 }}>
        <span style={{ fontWeight: 500 }}>↗ {growth}</span> <span style={{ color: '#6b7280', fontWeight: 400 }}>vs last month</span>
      </div>
    </div>
  );
}

export default DashboardPage;
