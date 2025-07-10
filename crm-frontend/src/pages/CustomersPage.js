import React, { useEffect, useState } from 'react';
import './CustomersPage.css';
import { FaPhone, FaEnvelope, FaBell, FaFilter } from 'react-icons/fa';
import axios from 'axios';

const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/customers/');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <div className="customers-page">
        {/* Top Nav */}
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

        {/* Search */}
        <input
            type="text"
            placeholder="Search customers..."
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        <div className="customer-table-header">
          <strong>Customer List</strong>
          <span>{filteredCustomers.length} customers</span>
        </div>

        <div className="customer-list">
          {loading ? (
              <div>Loading...</div>
          ) : error ? (
              <div>{error}</div>
          ) : filteredCustomers.length === 0 ? (
              <div>No customers found.</div>
          ) : (
              filteredCustomers.map((c, i) => (
                  <div key={c.id} className="customer-row">
                    <div className="customer-left">
                      <img
                          src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                          alt="Default Avatar"
                          className="default-avatar"
                      />

                      <div className="customer-info">
                        <strong>{c.name}</strong>
                        <div className="meta">{c.position || '-'}</div>
                        <div className="meta">
                          <FaEnvelope className="icon"/> {c.email} &nbsp;
                          <FaPhone className="icon"/> {formatPhoneNumber(c.phone_number)}
                        </div>
                      </div>
                    </div>
                    <div className="customer-right">
                      <div className="status green">Active</div>
                      <div>{c.company_name || '-'}</div>
                      <div
                          className="industry"
                          style={{color: c.industry_color || undefined}}
                      >
                        {c.industry
                            ? c.industry
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')
                            : '-'}
                      </div>

                    </div>
                  </div>
              ))
          )}
        </div>

        <div className="pagination">
          <span>Showing {filteredCustomers.length} customers</span>
        </div>

      </div>
  );
};

export default CustomersPage;