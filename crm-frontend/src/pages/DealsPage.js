import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DealsPage.css';
import { FaBell, FaMicrophone, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const VoiceDealCreator = () => {
  const [listening, setListening] = useState(false);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const startListening = () => {
    setListening(true);
    setError("");
    setSuccess("");
    setPreview("Listening...");

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setPreview(`You said: "${transcript}"`);
      setListening(false);

      try {
        await axios.post("/api/voice-deal/", { transcript });
        setSuccess("✅ Deal created successfully!");
      } catch (err) {
        console.error(err);
        setError("❌ Failed to create deal.");
      }
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setError("❌ Speech recognition error.");
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div className="voice-deal">
      <h4><FaMicrophone /> AI Voice Deal Creator</h4>
      <p className="subtext">Speak to create deals instantly</p>
      <button
        onClick={startListening}
        disabled={listening}
        style={{ marginTop: "10px" }}
      >
        {listening ? "Listening..." : "Click to start recording"}
      </button>
      <p className="voice-preview">{preview}</p>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDeals = async () => {
    try {
      const res = await axios.get('/api/deals/');
      setDeals(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch deals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const stageClass = (stage) => {
    switch (stage.toLowerCase()) {
      case 'proposal': return 'proposal';
      case 'qualified': return 'qualified';
      case 'negotiation': return 'negotiation';
      default: return '';
    }
  };

  const stageLabel = (stage) => {
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  return (
    <div className="deals-page">
      <nav className="top-nav">
        <div className="nav-left">CRM Project</div>
        <div className="nav-center">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/companies" className="nav-link">Companies</a>
          <a href="/customers" className="nav-link">Customers</a>
          <a href="/deals" className="nav-link active">Deals</a>
          <a href="/user-management" className="nav-link">Management</a>
          <a href="/activity-log" className="nav-link">Activity</a>
        </div>
        <div className="nav-right">
          <FaBell className="nav-icon" />
          <img src="https://i.pravatar.cc/32?img=5" alt="User" className="profile-avatar" />
        </div>
      </nav>

      <h1 className="page-title">Deals <span className="page-subtitle">Pipeline Management</span></h1>

      <div className="deals-layout">
        <div className="deals-table-section">
          <h3>Active Deals</h3>
          <table className="deals-table">
            <thead>
              <tr>
                <th>Deal Name</th>
                <th>Company</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Close Date</th>
                <th>Contacts</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="6">{error}</td></tr>
              ) : deals.length === 0 ? (
                <tr><td colSpan="6">No deals found.</td></tr>
              ) : (
                deals.map((deal) => (
                  <tr key={deal.id}>
                    <td>
                      <Link to={`/deal-details/${deal.id}`} className="deal-link">
                        {deal.title}
                      </Link>
                    </td>

                    <td>{deal.company_name}</td>
                    <td>${parseFloat(deal.amount).toLocaleString()}</td>
                    <td className={`${stageClass(deal.stage)} stage-cell`}>{stageLabel(deal.stage)}</td>
                    <td>{deal.close_date}</td>
                    <td>
                      <div className="deal-contact-info">
                        {deal.contacts.map(c => (
                          <div key={c.id} className="deal-contact">
                            <img src={c.avatar_url} alt={c.name} className="contact-avatar" />
                            <div className="contact-details">
                              <span className="contact-name">{c.name}</span>
                              <div className="contact-icons">
                                {c.email && (
                                  <a href={`mailto:${c.email}`} title={`Email ${c.name}`}>
                                    <FaEnvelope />
                                  </a>
                                )}
                                {c.phone_number && (
                                  <a href={`tel:${c.phone_number}`} title={`Call ${c.name}`}>
                                    <FaPhone />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {deal.contacts.length === 0 && <span>—</span>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="deals-sidebar">
          <VoiceDealCreator />
        </div>
      </div>
    </div>
  );
};

export default DealsPage;