import React from 'react';
import './CustomersPage.css';
import {FaPhone, FaEnvelope, FaBell} from 'react-icons/fa';

const customers = [
  {
    name: "John Smith",
    role: "Senior Developer",
    email: "john.smith@techcorp.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://i.pravatar.cc/40?img=1",
    status: "Active",
    company: "Tech Corp",
    industry: "Technology",
    color: "green"
  },
  {
    name: "Sarah Johnson",
    role: "UI/UX Designer",
    email: "sarah.j@designstudio.com",
    phone: "+1 (555) 234-5678",
    avatar: "https://i.pravatar.cc/40?img=2",
    status: "Active",
    company: "Design Studio",
    industry: "Creative",
    color: "green"
  },
  {
    name: "Michael Chen",
    role: "Marketing Director",
    email: "m.chen@marketinginc.com",
    phone: "+1 (555) 345-6789",
    avatar: "https://i.pravatar.cc/40?img=3",
    status: "Pending",
    company: "Marketing Inc",
    industry: "Marketing",
    color: "orange"
  },
  {
    name: "Emily Davis",
    role: "Product Manager",
    email: "emily.davis@innovate.com",
    phone: "+1 (555) 456-7890",
    avatar: "https://i.pravatar.cc/40?img=4",
    status: "Active",
    company: "Innovate Solutions",
    industry: "Technology",
    color: "green"
  },
  {
    name: "David Wilson",
    role: "Sales Executive",
    email: "d.wilson@salesforce.com",
    phone: "+1 (555) 567-8901",
    avatar: "https://i.pravatar.cc/40?img=5",
    status: "Inactive",
    company: "SalesForce Pro",
    industry: "Sales",
    color: "red"
  },
  {
    name: "Lisa Anderson",
    role: "HR Manager",
    email: "lisa.anderson@hrplus.com",
    phone: "+1 (555) 678-9012",
    avatar: "https://i.pravatar.cc/40?img=6",
    status: "Active",
    company: "HR Plus",
    industry: "Human Resources",
    color: "green"
  }
];

const CustomersPage = () => {
  return (
    <div className="customers-page">
      <nav className="top-nav">
        <div className="nav-left">CRM Project</div>
        <div className="nav-center">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/companies" className="nav-link">Companies</a>
          <a href="/customers" className="nav-link active">Customers</a>
          <a href="/deals" className="nav-link">Deals</a>
          <a href="/user-management" className="nav-link">Management</a>
          <a href="/activity-log" className="nav-link">Activity</a>
        </div>
        <div className="nav-right">
          <FaBell className="nav-icon"/>
          <img src="https://i.pravatar.cc/32?img=5" alt="User" className="profile-avatar"/>
        </div>
      </nav>

      <h1 className="page-title">Customers</h1>
      <p className="page-subtitle">Manage your customer database</p>

      <input type="text" placeholder="Search customers..." className="search-bar"/>

      <div className="customer-table-header">
        <strong>Customer List</strong>
        <span>245 customers</span>
      </div>

      <div className="customer-list">
        {customers.map((c, i) => (
            <div key={i} className="customer-row">
              <div className="customer-left">
                <img src={c.avatar} alt={c.name}/>
                <div>
                  <strong>{c.name}</strong>
                  <div className="meta">{c.role}</div>
                  <div className="meta">
                    <FaEnvelope className="icon"/> {c.email} &nbsp;
                    <FaPhone className="icon"/> {c.phone}
                  </div>
              </div>
            </div>
            <div className="customer-right">
              <div className={`status ${c.color}`}>{c.status}</div>
              <div>{c.company}</div>
              <div className="industry">{c.industry}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <span>Showing 1 to 6 of 245 results</span>
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

export default CustomersPage;