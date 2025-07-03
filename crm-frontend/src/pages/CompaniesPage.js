import React from 'react';
import './CompaniesPage.css';
import {FaEye, FaEdit, FaFilter, FaBell} from 'react-icons/fa';

const companies = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    website: 'www.techcorp.com',
    industry: 'Technology',
    industryColor: 'blue',
    location: 'San Francisco, CA',
    contacts: [
      'https://i.pravatar.cc/32?img=1',
      'https://i.pravatar.cc/32?img=2',
      'https://i.pravatar.cc/32?img=3'
    ],
    contactNote: '+2 more'
  },
  {
    id: 2,
    name: 'HealthPlus Medical',
    website: 'www.healthplus.com',
    industry: 'Healthcare',
    industryColor: 'green',
    location: 'New York, NY',
    contacts: [
      'https://i.pravatar.cc/32?img=4',
      'https://i.pravatar.cc/32?img=5'
    ],
    contactNote: '2 contacts'
  },
  {
    id: 3,
    name: 'Global Finance Group',
    website: 'www.globalfinance.com',
    industry: 'Finance',
    industryColor: 'orange',
    location: 'London, UK',
    contacts: [
      'https://i.pravatar.cc/32?img=6',
      'https://i.pravatar.cc/32?img=7',
      'https://i.pravatar.cc/32?img=8'
    ],
    contactNote: '+3'
  }
];

const CompaniesPage = () => {
  return (
      <div className="companies-page">
        <nav className="top-nav">
          <div className="nav-left">CRM Project</div>
          <div className="nav-center">
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/companies" className="nav-link active">Companies</a>
            <a href="/customers" className="nav-link">Customers</a>
            <a href="/deals" className="nav-link">Deals</a>
            <a href="/user-management" className="nav-link">Management</a>
            <a href="/activity-log" className="nav-link">Activity</a>
          </div>
          <div className="nav-right">
            <FaBell className="nav-icon"/>
            <img src="https://i.pravatar.cc/32?img=5" alt="User" className="profile-avatar"/>
          </div>
        </nav>

        <h1 className="page-title">Companies</h1>
        <p className="page-subtitle">Manage your company database</p>

        <div className="companies-controls">
          <input type="text" placeholder="Search companies..." className="search-bar"/>
          <FaFilter className="filter-icon"/>
        </div>

        <table className="companies-table">
          <thead>
          <tr>
            <th>Company Name</th>
            <th>Industry</th>
            <th>Location</th>
            <th>Linked Contacts</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {companies.map((company) => (
              <tr key={company.id}>
                <td>
                  <div className="company-info">
                    <span className="company-icon">🏢</span>
                    <div>
                      <strong>{company.name}</strong><br/>
                      <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="company-link">
                        {company.website}
                      </a>
                    </div>
                  </div>
                </td>
                <td className={`industry ${company.industryColor.toLowerCase()}`}>{company.industry}</td>
                <td>{company.location}</td>
                <td>
                  <div className="contacts-cell">
                    {company.contacts.map((c, i) => (
                        <img key={i} src={c} alt="Contact" className="contact-avatar"/>
                    ))}
                    <span className="contact-note">{company.contactNote}</span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <FaEye className="action-icon"/>
                    <FaEdit className="action-icon"/>
                  </div>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        <div className="pagination">
          <span>Showing 1 to 3 of 47 companies</span>
          <div className="page-controls">
            <span>Previous</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>Next</span>
          </div>
        </div>
      </div>
  );
};

export default CompaniesPage;