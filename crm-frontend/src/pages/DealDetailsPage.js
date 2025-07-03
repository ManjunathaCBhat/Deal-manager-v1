import React from 'react';
import './DealDetailsPage.css';
import { FaDownload, FaBell } from 'react-icons/fa';

const DealDetailsPage = () => {
  return (
      <div className="deal-details-page">
        {/* Top Nav */}
        <nav className="top-nav">
          <div className="nav-left">CRM Project</div>
          <div className="nav-center">
            <a href="/dashboard" className="nav-link active">Dashboard</a>
            <a href="/companies" className="nav-link">Companies</a>
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

        {/* Header */}
        <div className="deal-header">
          <div>
            <h1>Enterprise Software License</h1>
            <p className="deal-status negotiation">$45,000</p>
            <div className="assigned-rep">
              <img src="https://i.pravatar.cc/40?img=4" alt="Michael Chen"/>
              <span>Michael Chen<br/><small>Senior Sales Rep</small></span>
            </div>
          </div>
          <div className="deal-meta">
            <span>Expected Close</span>
            <strong>Dec 15, 2024</strong>
            <a href="/edit">✏️ Edit Deal</a>
          </div>
        </div>

        {/* Main Sections */}
        <div className="deal-sections">
          {/* Left Panel */}
          <div className="deal-left">
            <section className="company-contact">
              <h3>Company & Contact Information</h3>
              <p><strong>Company:</strong> TechCorp Solutions</p>
              <p>Software Development<br/>500–1000 employees</p>
              <p><strong>Primary Contact:</strong> Sarah Johnson</p>
              <p>CTO<br/>+1 (555) 123-4567<br/>sarah.johnson@techcorp.com</p>
            </section>

            <section className="timeline">
              <h3>Timeline & Activity</h3>
              <ul>
                <li><strong>Discovery Call Completed</strong> — 2 hours ago<br/><small>Michael Chen confirmed $125K
                  budget.</small></li>
                <li><strong>Proposal Sent</strong> — Yesterday<br/><small>Custom integrations sent for review.</small>
                </li>
                <li><strong>Demo Scheduled</strong> — 3 days ago<br/><small>Scheduled for Dec 10th at 2PM.</small></li>
              </ul>
            </section>

            <section className="details">
              <h3>Deal Details</h3>
              <p><strong>Source:</strong> Website Inquiry</p>
              <p><strong>Priority:</strong> High</p>
              <p><strong>Service:</strong> Enterprise Software License</p>
              <p><strong>Probability:</strong> 75%</p>
              <p><strong>Notes:</strong> Budget approved. Decision expected end of Q4.</p>
            </section>
          </div>

          {/* Right Panel */}
          <div className="deal-right">
            <section className="tasks">
              <h3>Tasks & Reminders</h3>
              <ul>
                <li>🔴 Follow up on proposal — <small>Due: Today</small></li>
                <li>📄 Prepare contract documents — <small>Due: Dec 12</small></li>
                <li style={{textDecoration: 'line-through', color: '#9ca3af'}}>🎥 Send demo recording — Completed</li>
              </ul>
            </section>

            <section className="files">
              <h3>Files</h3>
              <ul>
                <li><FaDownload/> Proposal_TechCorp.pdf (2.3MB)</li>
                <li><FaDownload/> Contract_Draft.docx (1.8MB)</li>
                <li><FaDownload/> Product_Demo.png (4.1MB)</li>
              </ul>
              <button className="upload-btn">Upload File</button>
            </section>
          </div>
        </div>
      </div>
  );
};

export default DealDetailsPage;