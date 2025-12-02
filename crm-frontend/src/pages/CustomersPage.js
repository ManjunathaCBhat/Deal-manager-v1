import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { FaPhone, FaEnvelope } from "react-icons/fa";

const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Add Contact form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    company: "",
    status: "Active",
    source: "Website",
    linkedin: "",
    notes: "",
  });

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/customers/");
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

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      company: "",
      status: "Active",
      source: "Website",
      linkedin: "",
      notes: "",
    });
    setFormError("");
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    if (!saving) {
      setShowAddModal(false);
      setFormError("");
    }
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    setFormError("");

    const { firstName, lastName, email, phone, jobTitle, company } = form;

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setFormError("First name, last name, and email are required.");
      return;
    }

    const payload = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      phone_number: phone.trim() || null,
      position: jobTitle.trim() || null,
      company_name: company.trim() || null,
      // status/source/linkedin/notes are kept UI-side for now
    };

    try {
      setSaving(true);
      await api.post("/api/customers/", payload);
      await fetchCustomers();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setFormError("Failed to save contact. Please check the data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* HEADER ROW → Title + Add Contact */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", margin: 0 }}>
            Contacts
          </h1>
          <p style={{ color: "#6b7280", marginTop: "4px" }}>
            Manage your contact relationships
          </p>
        </div>

        <button
          onClick={openAddModal}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            border: "none",
            cursor: "pointer",
            height: "44px",
          }}
        >
          + Add Contact
        </button>
      </div>

      {/* SEARCH + FILTERS SECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {/* Search Box */}
        <div style={{ flex: 1, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "12px",
              transform: "translateY(-50%)",
              color: "#9ca3af",
            }}
          >
            🔍
          </span>

          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 40px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "15px",
            }}
          />
        </div>

        {/* FILTER TABS */}
        <div style={{ display: "flex", gap: "10px" }}>
          {["all", "active", "qualified", "inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: activeTab === tab ? "none" : "1px solid #d1d5db",
                background: activeTab === tab ? "#111827" : "#fff",
                color: activeTab === tab ? "#fff" : "#111827",
                fontWeight: "600",
                cursor: "pointer",
                minWidth: "90px",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Layout Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
        }}
      >
        {/* LEFT: CONTACT LIST TABLE */}
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
            Contacts ({filteredCustomers.length})
          </h2>

          <table style={{ width: "100%", borderSpacing: "0 12px" }}>
            <thead>
              <tr
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  textAlign: "left",
                }}
              >
                <th>Contact</th>
                <th>Company</th>
                <th>Status</th>
                <th>Last Contact</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ padding: "20px" }}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" style={{ padding: "20px" }}>
                    {error}
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: "20px", color: "#9ca3af" }}>
                    No contacts found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedContact(c)}
                    style={{
                      background:
                        selectedContact?.id === c.id ? "#eef2ff" : "#f9fafb",
                      borderRadius: "8px",
                      height: "60px",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        display: "flex",
                        gap: "12px",
                      }}
                    >
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                        alt=""
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                      <div>
                        <strong>{c.name}</strong>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          {c.email && (
                            <span>
                              <FaEnvelope size={12} /> {c.email}
                            </span>
                          )}
                          {c.phone_number && (
                            <span style={{ marginLeft: "10px" }}>
                              <FaPhone size={12} />{" "}
                              {formatPhoneNumber(c.phone_number)}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "12px" }}>
                      {c.company_name || "-"}
                    </td>
                    <td style={{ padding: "12px", color: "green" }}>Active</td>
                    <td style={{ padding: "12px", color: "#6b7280" }}>—</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT: CONTACT DETAILS PANEL */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "3rem 2rem",
            textAlign: "center",
            color: "#6b7280",
            minHeight: "400px",
          }}
        >
          {!selectedContact ? (
            <>
              <div
                style={{
                  fontSize: "60px",
                  opacity: "0.3",
                  marginBottom: "1rem",
                }}
              >
                👤
              </div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                No Contact Selected
              </h2>
              <p style={{ marginTop: "0.5rem", fontSize: "14px" }}>
                Select a contact from the list to view their details
              </p>
            </>
          ) : (
            <>
              <img
                src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                alt=""
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              />

              <h2
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                }}
              >
                {selectedContact.name}
              </h2>

              <p style={{ fontSize: "14px", color: "#6b7280" }}>
                {selectedContact.position || "No position"}
              </p>

              <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
                <p>
                  <strong>Company:</strong>{" "}
                  {selectedContact.company_name || "-"}
                </p>
                <p>
                  <strong>Email:</strong> {selectedContact.email || "-"}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {formatPhoneNumber(selectedContact.phone_number)}
                </p>
                <p>
                  <strong>Status:</strong> Active
                </p>
                <p>
                  <strong>Industry:</strong> {selectedContact.industry || "-"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ADD CONTACT MODAL */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2rem 2.5rem",
              boxShadow: "0 25px 50px rgba(15,23,42,0.35)",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.6rem", fontWeight: "700" }}>
                Add New Contact
              </h2>
              <button
                onClick={closeAddModal}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.3rem",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveContact}>
              {/* 2-column grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem 1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                {/* First Name */}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      handleFormChange("firstName", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      handleFormChange("lastName", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                  />
                </div>

                {/* Job Title */}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) =>
                      handleFormChange("jobTitle", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                  />
                </div>

                {/* Company */}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) =>
                      handleFormChange("company", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      handleFormChange("status", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                  >
                    <option>Active</option>
                    <option>Qualified</option>
                    <option>Inactive</option>
                  </select>
                </div>

                {/* Source */}
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Source
                  </label>
                  <select
                    value={form.source}
                    onChange={(e) =>
                      handleFormChange("source", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                    }}
                  >
                    <option>Website</option>
                    <option>Referral</option>
                    <option>LinkedIn</option>
                    <option>Event</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* LinkedIn URL */}
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedin}
                  onChange={(e) =>
                    handleFormChange("linkedin", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>

              {/* Notes */}
              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="Internal notes about this contact..."
                  value={form.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    resize: "vertical",
                  }}
                />
              </div>

              {formError && (
                <div
                  style={{
                    color: "#b91c1c",
                    fontSize: "13px",
                    marginBottom: "0.75rem",
                  }}
                >
                  {formError}
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={saving}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    background: "#fff",
                    cursor: "pointer",
                    minWidth: "100px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    fontWeight: "600",
                    cursor: "pointer",
                    minWidth: "130px",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? "Saving..." : "Save Contact"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
