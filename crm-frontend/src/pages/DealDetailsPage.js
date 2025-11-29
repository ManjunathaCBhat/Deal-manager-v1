import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from '../api/axios';
import "./DealDetailsPage.css";
import { FaBell, FaPhone, FaEnvelope } from "react-icons/fa";
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const DealDetailsPage = () => {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await api.get(`/api/deals/${id}/`);
        setDeal(response.data);
        console.log("Fetched deal:", response.data);
      } catch (err) {
        console.error("Failed to fetch deal", err);
      }
    };
    fetchDeal();
  }, [id]);

  if (!deal) {
    console.log("No deal yet:", deal);
    return <div>Loading...</div>;
  }

  const formatPhone = (phone) => {
    if (!phone) return "N/A";
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
  };

  const stageColorClass = (stage) => {
    switch (stage.toLowerCase()) {
      case "proposal":
        return "stage-proposal";
      case "qualified":
        return "stage-qualified";
      case "negotiation":
        return "stage-negotiation";
      default:
        return "";
    }
  };

  return (
    <div className="deal-details-page">
         <div className="deal-header-row">
        <Link to="/deals" className="back-link">&larr; Back to Deals</Link>
      </div>

      <div className="deal-header">
        <h1>{deal.title}</h1>
        <div className="deal-meta">
          <div className="deal-stage-container">
            <span className={`deal-stage ${stageColorClass(deal.stage)}`}></span>
            <span className="deal-stage-text">{deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}</span>
          </div>
          <span className="deal-amount">${parseFloat(deal.amount).toLocaleString()}</span>
          <Link to={`/deals/edit/${deal.id}`} className="edit-link">Edit Deal</Link>
        </div>
      </div>

      <div className="deal-info-grid">
        <div>
          <h3>Company</h3>
          <p className="company-name">{deal.company_name}</p>
        </div>
        <div>
          <h3>Primary Contact</h3>
          {deal.contacts?.length > 0 ? (
            <div className="contact-info">
              <img src={deal.contacts[0].avatar_url} alt={deal.contacts[0].name} />
              <div className="contact-details">
                <strong>{deal.contacts[0].name}</strong>
                <span>{deal.contacts[0].position || "N/A"}</span>
                {deal.contacts[0].phone_number && (
                  <a href={`tel:${deal.contacts[0].phone_number}`}>
                    <FaPhone /> {formatPhone(deal.contacts[0].phone_number)}
                  </a>
                )}
                {deal.contacts[0].email && (
                  <a href={`mailto:${deal.contacts[0].email}`}>
                    <FaEnvelope /> {deal.contacts[0].email}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p>No contact assigned</p>
          )}
        </div>
      </div>

      <div className="expected-close">
        <h3>Expected Close</h3>
        <p>{deal.close_date}</p>
      </div>
    </div>
  );
};

export default DealDetailsPage;