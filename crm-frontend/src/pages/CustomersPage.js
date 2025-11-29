import React, { useEffect, useState } from 'react';
import './CustomersPage.css';
import { FaPhone, FaEnvelope, FaBell } from 'react-icons/fa';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

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

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const fetchCustomers = async () => {
    try {
      const res = await api.get('/api/customers/');
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
          filteredCustomers.map((c) => (
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
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="contact-link"
                      >
                        <FaEnvelope className="icon" /> {c.email}
                      </a>
                    )}
                    {c.phone_number && (
                      <a
                        href={`tel:${c.phone_number}`}
                        className="contact-link"
                      >
                        <FaPhone className="icon" /> {formatPhoneNumber(c.phone_number)}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="customer-right">
                <div className="status green">Active</div>
                <div>{c.company_name || '-'}</div>
                <div
                  className="industry"
                  style={{ color: c.industry_color || undefined }}
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