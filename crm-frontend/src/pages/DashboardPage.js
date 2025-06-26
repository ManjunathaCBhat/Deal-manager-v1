import React from 'react';
import './DashboardPage.css';
import { FaHandshake, FaBuilding, FaUserPlus, FaDollarSign, FaFilter, FaBell, FaUserCircle } from 'react-icons/fa';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      {/* Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-left">CRM Project</div>
        <div className="nav-center">
          <a href="/" className="nav-link active">Deals</a>
          <a href="/" className="nav-link">Companies</a>
          <a href="/" className="nav-link">Deals</a>
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
        <KpiCard icon={<FaHandshake />} value="247" label="Total Deals" growth="+12% from last month" />
        <KpiCard icon={<FaBuilding />} value="89" label="Active Companies" growth="+8% from last month" />
        <KpiCard icon={<FaUserPlus />} value="156" label="New Contacts" growth="+23% from last month" />
        <KpiCard icon={<FaDollarSign />} value="$2.4M" label="Pipeline Value" growth="+18% from last month" />
      </div>

      {/* Active Deals */}
      <div className="section-header">
        <h3>Active Deals</h3>
        <FaFilter className="filter-icon" />
      </div>

      <table className="deals-table">
        <thead>
          <tr>
            <th>Deal Name</th>
            <th>Company</th>
            <th>Deal Value</th>
            <th>Stage</th>
            <th>Conversion Probability</th>
            <th>Owner</th>
            <th>Close Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal, index) => (
            <tr key={index}>
              <td>{deal.name}</td>
              <td>{deal.company}</td>
              <td>{deal.value}</td>
              <td className={`stage ${deal.stageColor}`}>{deal.stage}</td>
              <td className={deal.probColor}>{deal.probability}</td>
              <td className="owner-cell"><FaUserCircle className="owner-icon" /> {deal.owner}</td>
              <td>{deal.closeDate}</td>
              <td className="action-icon">✏️</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-section">
        <span>Showing 1 to 5 of 247 deals</span>
        <div className="pagination-controls">
          <span>Previous</span>
          <span className="active">1</span>
          <span>2</span>
          <span>3</span>
          <span>Next</span>
        </div>
      </div>

      {/* Recent Customers */}
      <div className="recent-customers">
        <div className="recent-header">
          <h3>Recent Customers</h3>
          <a href="/">View All</a>
        </div>
        {customers.map((c, i) => (
          <div key={i} className="customer-row">
            <img src={c.avatar} alt={c.name} className="customer-avatar" />
            <div className="customer-info">
              <strong>{c.name}</strong>
              <p>{c.email}</p>
            </div>
            <span className="customer-amount">{c.amount} • Last order</span>
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

const deals = [
  { name: 'Enterprise Software License', company: 'TechCorp Inc.', value: '$125,000', stage: 'Proposal', stageColor: 'blue', probability: 'High - 85%', probColor: 'green', owner: 'John Smith', closeDate: 'Dec 15, 2024' },
  { name: 'Marketing Automation Setup', company: 'Growth Solutions', value: '$45,000', stage: 'Negotiation', stageColor: 'orange', probability: 'Medium - 62%', probColor: 'yellow', owner: 'Sarah Johnson', closeDate: 'Jan 8, 2025' },
  { name: 'Cloud Migration Services', company: 'DataFlow Systems', value: '$89,500', stage: 'Qualification', stageColor: 'red', probability: 'Low - 28%', probColor: 'red', owner: 'Mike Davis', closeDate: 'Feb 20, 2025' },
  { name: 'Security Audit Package', company: 'SecureBank Ltd', value: '$67,800', stage: 'Closing', stageColor: 'green', probability: 'High - 92%', probColor: 'green', owner: 'Emily Chen', closeDate: 'Dec 28, 2024' },
  { name: 'Custom CRM Integration', company: 'InnovateTech', value: '$34,200', stage: 'Discovery', stageColor: 'purple', probability: 'Medium - 55%', probColor: 'yellow', owner: 'Alex Rodriguez', closeDate: 'Mar 15, 2025' }
];

const customers = [
  { name: 'Michael Chen', email: 'michael.chen@company.com', amount: '$12,500', avatar: 'https://i.pravatar.cc/40?img=1' },
  { name: 'Emma Rodriguez', email: 'emma.rodriguez@startup.io', amount: '$8,750', avatar: 'https://i.pravatar.cc/40?img=2' },
  { name: 'David Thompson', email: 'david.thompson@enterprise.com', amount: '$25,000', avatar: 'https://i.pravatar.cc/40?img=3' }
];

export default DashboardPage;
