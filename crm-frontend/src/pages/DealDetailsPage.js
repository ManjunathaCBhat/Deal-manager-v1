// src/pages/DealDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DealDetailsPage.css';
import { FaBell, FaMicrophone } from 'react-icons/fa';


function DealDetailsPage() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await axios.get(`/api/deals/${id}/`);
        setDeal(response.data);
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error('Error fetching deal:', error);
      }
    };
    fetchDeal();
  }, [id]);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    const updatedTasks = [...tasks, newTask.trim()];
    setTasks(updatedTasks);
    setNewTask("");
  };

  const formatPhone = (number) => {
    if (!number) return '';
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length !== 10) return number;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  };

  if (!deal) {
    return <div className="deal-details-page">Loading...</div>;
  }

  return (
      <div className="deal-details-page">
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
            <FaBell className="nav-icon"/>
            <img src="https://i.pravatar.cc/32?img=5" alt="User" className="profile-avatar"/>
          </div>
        </nav>
        <div className="deal-header">
          <div>
            <h1>{deal.title}</h1>
            <div className={`deal-status ${deal.stage.toLowerCase()}`}>
              {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
            </div>
            <div className="assigned-rep">
              <img
                  src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                  alt="Default Avatar"
                  className="default-avatar"
              />
              <span>
              {deal.contacts?.[0]?.name || 'Rep Assigned'}
                <br/>
              <small>{deal.contacts?.[0]?.position || 'Sales Representative'}</small>
            </span>
            </div>
          </div>
          <div className="deal-meta">
            <h2 style={{color: '#10b981'}}>
              ${parseFloat(deal.amount).toLocaleString()}
            </h2>
            <a href={`/deals/edit/${deal.id}`}>Edit Deal</a>
          </div>
        </div>

        <div className="deal-sections">
          <div className="deal-left">
            <section>
              <h3>Deal Description</h3>
              <p>{deal.description || 'No description provided.'}</p>
            </section>

            <section className="company-contact">
              <h3>Company & Contact Information</h3>
              <p><strong>Company:</strong> {deal.company_name}</p>
              <p><strong>Contacts:</strong></p>
              {deal.contacts && deal.contacts.length > 0 ? (
                  deal.contacts.map((c) => (
                      <div key={c.id} className="contact-block">
                        <p><strong>{c.name}</strong></p>
                        <p>{c.position}</p>
                        <p>{formatPhone(c.phone_number)}</p>
                        <p>{c.email}</p>
                        <img
                            src={`https://i.pravatar.cc/40?u=${c.email}`}
                            alt={c.name}
                            className="customer-avatar"
                        />
                      </div>
                  ))
              ) : (
                  <p>—</p>
              )}
            </section>
          </div>

          <div className="deal-right">
            <section className="tasks">
              <h3>Tasks</h3>
              <ul>
                {tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                ))}
              </ul>
              <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="New task"
                  className="task-input"
              />
              <button onClick={handleAddTask} className="upload-btn">Add Task</button>
            </section>

            <section className="timeline">
              <h3>Timeline</h3>
              <ul>
                <li>Created: {new Date(deal.created_at).toLocaleDateString()}</li>
                <li>Expected Close: {deal.close_date || 'TBD'}</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
  );
}

export default DealDetailsPage;
