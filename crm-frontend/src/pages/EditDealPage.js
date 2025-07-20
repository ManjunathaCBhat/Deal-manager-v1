import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditDealPage.css";

const EditDealPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deal, setDeal] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealRes = await axios.get(`/api/deals/${id}/`);
        const companiesRes = await axios.get(`/api/companies/`);
        const customersRes = await axios.get(`/api/customers/`);
        setDeal(dealRes.data);
        setCompanies(companiesRes.data);
        setCustomers(customersRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load deal or related data.");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setDeal({ ...deal, [e.target.name]: e.target.value });
  };

  const handleContactsChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map((o) => o.value);
    setDeal({ ...deal, contacts: options });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
        await axios.put(`/api/deals/${id}/`, deal);
        navigate(`/deal-details/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return <div className="edit-deal-container">{error}</div>;
  }

  if (!deal) {
    return <div className="edit-deal-container">Loading…</div>;
  }

  return (
    <div className="edit-deal-container">
      <h1>Edit Deal</h1>
      <form onSubmit={handleSubmit} className="edit-deal-form">
        <label>Title:</label>
        <input
          name="title"
          value={deal.title || ""}
          onChange={handleChange}
          required
        />

        <label>Amount:</label>
        <input
          name="amount"
          type="number"
          value={deal.amount || ""}
          onChange={handleChange}
          required
        />

        <label>Stage:</label>
        <select
          name="stage"
          value={deal.stage || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select a stage</option>
          <option value="proposal">Proposal</option>
          <option value="qualified">Qualified</option>
          <option value="negotiation">Negotiation</option>
        </select>

        <label>Close Date:</label>
        <input
          name="close_date"
          type="date"
          value={deal.close_date || ""}
          onChange={handleChange}
          required
        />

        <label>Company:</label>
        <select
          name="company"
          value={deal.company || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select a company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Contacts:</label>
        <select
          multiple
          value={deal.contacts || []}
          onChange={handleContactsChange}
        >
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div>
          <button
            type="submit"
            className="save-button"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(`/deal-details/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDealPage;