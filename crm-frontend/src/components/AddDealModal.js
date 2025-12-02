import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { FaRegSave } from "react-icons/fa";

const AddDealModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    contact: "",
    company: "",
    stage: "prospecting",
    close_date: "",
    priority: "medium",
    source: "website",
    next_step: "",
    description: "",
  });

  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [contactsRes, companyRes] = await Promise.all([
          api.get("/api/contacts/"),
          api.get("/api/companies/"),
        ]);
        setContacts(contactsRes.data);
        setCompanies(companyRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/api/deals/", form);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create deal.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-[700px] max-h-[90vh] overflow-y-auto shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Deal</h2>
          <button className="text-gray-500 hover:text-black" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-2 gap-6">

          {/* DEAL NAME */}
          <div className="col-span-1">
            <label className="text-sm font-semibold">Deal Name *</label>
            <input
              type="text"
              name="title"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="Enter deal name"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* VALUE */}
          <div className="col-span-1">
            <label className="text-sm font-semibold">Value *</label>
            <input
              type="number"
              name="amount"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="$ 5000"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          {/* CONTACT */}
          <div>
            <label className="text-sm font-semibold">Contact</label>
            <select
              name="contact"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={form.contact}
              onChange={handleChange}
            >
              <option value="">Select contact</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* COMPANY */}
          <div>
            <label className="text-sm font-semibold">Company</label>
            <select
              name="company"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={form.company}
              onChange={handleChange}
            >
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* STAGE */}
          <div>
            <label className="text-sm font-semibold">Stage</label>
            <select
              name="stage"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={form.stage}
              onChange={handleChange}
            >
              <option value="prospecting">Prospecting</option>
              <option value="qualification">Qualification</option>
              <option value="proposal">Proposal</option>
            </select>
          </div>

          {/* CLOSE DATE */}
          <div>
            <label className="text-sm font-semibold">Expected Close Date</label>
            <input
              type="date"
              name="close_date"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={form.close_date}
              onChange={handleChange}
            />
          </div>

          {/* PRIORITY */}
          <div>
            <label className="text-sm font-semibold">Priority</label>
            <select
              name="priority"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* SOURCE */}
          <div>
            <label className="text-sm font-semibold">Source</label>
            <select
              name="source"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={form.source}
              onChange={handleChange}
            >
              <option value="website">Website</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="referral">Referral</option>
            </select>
          </div>

        </div>

        {/* NEXT STEP */}
        <div className="mt-6">
          <label className="text-sm font-semibold">Next Step</label>
          <input
            type="text"
            name="next_step"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="e.g., Send follow-up email"
            value={form.next_step}
            onChange={handleChange}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mt-6">
          <label className="text-sm font-semibold">Description</label>
          <textarea
            name="description"
            rows="4"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="Details about the deal..."
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <FaRegSave />
            Save Deal
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddDealModal;
