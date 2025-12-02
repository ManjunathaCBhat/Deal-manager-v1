import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import "./CompaniesPage.css";
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';


const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/api/companies/");
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
    <div className="companies-page-layout">
      {/* Left Section */}
      <div className="companies-left">
        <div className="header-section">
          <div className="header-top">
            <div>
              <h1 className="page-title">Companies</h1>
              <p className="page-subtitle">Manage your business relationships</p>
            </div>

            <button className="add-company-btn">
              <FaPlus /> Add Company
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        {/* <div className="search-filter-card">
          <div className="search-filter-section">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search companies..."
                className="search-bar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="filter-btn">All Industries</button>
          </div>
        </div> */}


        {/* Companies Count Header */}
        <div className="companies-card">
          <div className="companies-header">
            <h2>Companies ({filteredCompanies.length})</h2>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="companies-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Size</th>
                  <th>Contacts</th>
                  <th>Deal Value</th>
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
                    <tr key={company.id} onClick={() => setSelectedCompany(company)} className={selectedCompany?.id === company.id ? 'selected' : ''}>
                      <td>
                        <div className="company-info">
                          {/* <span className="company-icon">🏢</span> */}
                          <strong>{company.name || "-"}</strong>
                        </div>
                      </td>
                      <td>{company.industry || "-"}</td>
                      <td>{company.size || "-"}</td>
                      <td>{company.customers?.length || 0}</td>
                      <td>{company.deal_value || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="companies-right">
        <div className="panel-card">
          {selectedCompany ? (
            <div className="company-details">
              <h3>{selectedCompany.name}</h3>
              <p>Details will appear here</p>
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">🏢</div>
              <h3>No Company Selected</h3>
              <p>Select a company from the list to view their details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default CompaniesPage;
