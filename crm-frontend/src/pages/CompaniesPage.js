import React, { useEffect, useState } from "react";
import api from '../api/axios';
import { FaEye, FaEdit, FaFilter, FaBell, FaEnvelope, FaPhone } from "react-icons/fa";
import "./CompaniesPage.css";
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';


const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/companies/");
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="companies-page">
      <h1 className="page-title">Companies</h1>
      <p className="page-subtitle">Manage your company database</p>

      {/* Search */}
      <div className="companies-controls">
        <input
            type="text"
            placeholder="Search companies..."
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        <FaFilter className="filter-icon" />
      </div>

      {/* Table */}
      <div className="table-wrapper">
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
            {loading ? (
              <tr>
                <td colSpan="5" className="loading-cell">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="error-cell">{error}</td>
              </tr>
            ) : filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">No companies found.</td>
              </tr>
            ) : (
              filteredCompanies.map((company) => (
                <tr key={company.id}>
                  <td>
                    <div className="company-info">
                      <span className="company-icon">🏢</span>
                      <div>
                        <strong>{company.name || "-"}</strong><br />
                        {company.website && (
                          <a
                            href={
                              company.website.startsWith("http")
                                ? company.website
                                : `https://${company.website}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="company-link"
                          >
                            {company.website}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`industry industry-${company.industry?.toLowerCase() || "default"}`}
                      style={{ color: company.industry_color || undefined }}
                    >
                      {company.industry?.split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ') || "-"}
                    </span>
                  </td>
                  <td>{company.location || "-"}</td>
                  <td>
                    <div className="contact-info">
                      {company.customers?.length > 0 ? (
                        company.customers.map(c => (
                          <div key={c.id} className="contact-card">
                            <img
                              src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                              alt={c.name}
                            />
                            <span className="contact-name">{c.name}</span>
                            <div className="contact-links">
                              {c.email && (
                                <a href={`mailto:${c.email}`} title={c.email}>
                                  <FaEnvelope />
                                </a>
                              )}
                              {c.phone_number && (
                                <a href={`tel:${c.phone_number}`} title={c.phone_number}>
                                  <FaPhone />
                                </a>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <FaEye className="action-icon" />
                      <FaEdit className="action-icon" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span>Showing {filteredCompanies.length} companies</span>
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
