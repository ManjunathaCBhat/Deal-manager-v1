import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardPage.css';
import {
  FaHandshake,
  FaBuilding,
  FaUserPlus,
  FaDollarSign,
  FaBell,
  FaUserCircle,
  FaEdit
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
      case 'qualification': return 'red';
      case 'closing': return 'green';
      case 'discovery': return 'purple';
      default: return '';
    }
  };

  return (
    <div className="dashboard-page">
      {/* Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-left">CRM Project</div>
        <div className="nav-center">
          <a href="/dashboard" className="nav-link active">Dashboard</a>
          <a href="/companies" className="nav-link">Companies</a>
          <a href="/customers" className="nav-link">Customers</a>
          <a href="/deals" className="nav-link">Deals</a>
          <a href="/user-management" className="nav-link">Management</a>
          <a href="/activity-log" className="nav-link">Activity</a>
        </div>
        <div className="nav-right">
          <FaBell className="nav-icon" />
          <img src="https://i.pravatar.cc/32?img=5" alt="User" className="profile-avatar" />
        </div>
      </nav>

      {/* Header */}
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Manage and track your sales opportunities</p>

      {/* KPIs */}
      <div className="kpi-grid">
        <KpiCard icon={<FaHandshake />} value={totalDeals} label="Total Deals" growth="+12% from last month" />
        <KpiCard icon={<FaBuilding />} value={totalCompanies} label="Active Companies" growth="+8% from last month" />
        <KpiCard icon={<FaUserPlus />} value={totalContacts} label="New Contacts" growth="+23% from last month" />
        <KpiCard icon={<FaDollarSign />} value={`$${pipelineValue.toLocaleString()}`} label="Pipeline Value" growth="+18% from last month" />
      </div>

      {/* Active Deals */}
      <div className="section-header">
        <h3>Active Deals</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
            <tr><td colSpan="7">Loading...</td></tr>
          ) : deals.length === 0 ? (
            <tr><td colSpan="7">No deals available.</td></tr>
          ) : (
            deals.map((deal) => (
              <tr key={deal.id}>
                <td>{deal.title}</td>
                <td>{deal.company_name}</td>
                <td>${parseFloat(deal.amount).toLocaleString()}</td>
                <td className={`stage ${stageColor(deal.stage)}`}>{deal.stage}</td>
                <td>
                  {deal.contacts.length > 0 ? deal.contacts.map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img src={c.avatar_url} alt={c.name} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                      {c.name}
                    </div>
                  )) : '—'}
                </td>
                <td>{deal.close_date || '—'}</td>
                <td className="action-icon">
                  <FaEdit />
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
        {customers.slice(0, 3).map((c) => (
          <div key={c.id} className="customer-row">
            <div className="customer-left">
                <img src={`https://i.pravatar.cc/40?u=${c.email}`} alt={c.name} className="customer-avatar"/>
                <div className="customer-info">
                    <strong>{c.name}</strong>
                    <p>{c.email}</p>
              </div>
            </div>
            <span className="customer-amount">New Contact</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiCard({ icon, value, label, growth }) {
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
