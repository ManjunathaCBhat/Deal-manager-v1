import React, { useEffect, useState } from "react";
import { Users, Building2, Target, TrendingUp, Calendar } from "lucide-react";
import api from '../api/axios';

// Card component, reusable for KPIs
function KpiCard({ label, value, icon, growth, growthText, growthColor }) {
  return (
    <div style={{
      flex: 1,
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    }}>
      <div style={{
        background: "#f1f5f9",
        borderRadius: "12px",
        padding: "0.75rem",
        marginBottom: "1rem"
      }}>
        {icon}
      </div>
      <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "0.5rem" }}>{value}</div>
      <div style={{ color: growthColor || "#22c55e", fontWeight: 600, fontSize: "1rem" }}>
        {growth} <span style={{ color: "#64748b", fontWeight: 400 }}>{growthText}</span>
      </div>
    </div>
  );
}

// You can set fallback demo data here for dev/demo mode
const DEMO_DATA = {
  total_contacts: 30,
  contacts_growth: "+12.5%",
  total_companies: 7,
  companies_growth: "+20%",
  active_deals: 5,
  deals_growth: "+8.6%",
  revenue: "273,000",
  revenue_growth: "+13%",
  top_performers: [
    { name: "Sarah Johnson", deals: 12, revenue: "$145,000", growth: "+23%" },
    { name: "Mike Chen", deals: 9, revenue: "$98,000", growth: "+18%" },
    { name: "Emily Davis", deals: 8, revenue: "$87,000", growth: "+15%" }
  ],
  tasks: [],
  pipeline: [
    { stage: "Prospecting", color: "#3b82f6", deals: 12, amount: "$45,000" },
    { stage: "Qualification", color: "#eab308", deals: 8, amount: "$32,000" },
    { stage: "Proposal", color: "#fb923c", deals: 5, amount: "$28,000" },
    { stage: "Negotiation", color: "#ef4444", deals: 3, amount: "$18,000" },
    { stage: "Closed Won", color: "#22c55e", deals: 7, amount: "$95,000" }
  ]
};

export default function DashboardPage({ useDemo = false }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useDemo) {
      setDashboard(DEMO_DATA);
      setLoading(false);
      return;
    }
    api.get("/api/dashboard-metrics/")
      .then(res => {
        setDashboard(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [useDemo]);

  if (loading) return <div>Loading...</div>;
  if (!dashboard) return <div>Error loading dashboard data.</div>;

  // Prepare the data for KPI cards
  const kpiData = [
    {
      label: "Total Contacts",
      value: dashboard.total_contacts,
      icon: <Users size={32} color="#3b82f6" />,
      growth: dashboard.contacts_growth,
      growthText: "vs last month"
    },
    {
      label: "Companies",
      value: dashboard.total_companies,
      icon: <Building2 size={32} color="#22c55e" />,
      growth: dashboard.companies_growth,
      growthText: "vs last month"
    },
    {
      label: "Active Deals",
      value: dashboard.active_deals,
      icon: <Target size={32} color="#a78bfa" />,
      growth: dashboard.deals_growth,
      growthText: "vs last month"
    },
    {
      label: "Revenue",
      value: `$${dashboard.revenue}`,
      icon: <TrendingUp size={32} color="#fb923c" />,
      growth: dashboard.revenue_growth,
      growthText: "vs last month"
    }
  ];

  const quickActions = [
    { label: "Add Contact", icon: <Users size={24} />, color: "#3b82f6" },
    { label: "Add Deal", icon: <Target size={24} />, color: "#22c55e" },
    { label: "Schedule Meeting", icon: <Calendar size={24} />, color: "#a78bfa" }
  ];

  return (
    <div style={{ padding: "2rem", background: "#f8fafc", minHeight: "100vh" }}>
      {/* KPI Cards */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        {kpiData.map((card, idx) => (
          <KpiCard key={idx} {...card} />
        ))}
      </div>

      {/* Middle Section */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        {/* Quick Actions */}
        <div style={{ flex: 2, background: "#fff", borderRadius: "16px", padding: "1.5rem", marginRight: "2rem" }}>
          <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "1.5rem" }}>Quick Actions</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {quickActions.map((action, idx) => (
              <button key={idx} style={{
                flex: 1,
                background: "#f1f5f9",
                border: "none",
                borderRadius: "12px",
                padding: "1.2rem",
                fontWeight: 600,
                fontSize: "1rem",
                color: action.color,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer"
              }}>
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top Performers & Upcoming Tasks */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Top Performers */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem" }}>
            <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "1rem" }}>Top Performers</div>
            {dashboard.top_performers && dashboard.top_performers.length > 0 ? dashboard.top_performers.map((p, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: ["#fde68a", "#e0e7ff", "#fbcfe8"][idx % 3],
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem", marginRight: "1rem"
                }}>{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: "0.95rem", color: "#64748b" }}>{p.deals} deals • {p.revenue}</div>
                </div>
                <div style={{ color: "#22c55e", fontWeight: 600 }}>{p.growth}</div>
              </div>
            )) : <div style={{ color: "#64748b" }}>No performers</div>}
          </div>
          {/* Upcoming Tasks */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem" }}>
            <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "1rem" }}>Upcoming Tasks</div>
            {dashboard.tasks && dashboard.tasks.length > 0 ? dashboard.tasks.map((task, idx) => (
              <div key={idx} style={{ color: "#64748b", fontSize: "1rem", marginBottom: "0.5rem" }}>{task.title}</div>
            )) : <div style={{ color: "#64748b", fontSize: "1rem" }}>No upcoming tasks</div>}
          </div>
        </div>
      </div>

      {/* Deal Pipeline Overview */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", marginBottom: "2rem" }}>
        <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "1.5rem" }}>Deal Pipeline Overview</div>
        {dashboard.pipeline && dashboard.pipeline.length > 0 ? dashboard.pipeline.map((stage, idx) => (
          <div key={idx} style={{
            display: "flex", alignItems: "center", marginBottom: "1.2rem"
          }}>
            <div style={{
              width: "16px", height: "16px", borderRadius: "50%",
              background: stage.color, marginRight: "1rem"
            }} />
            <div style={{ flex: 1, fontWeight: 600 }}>{stage.stage}</div>
            <div style={{ color: "#64748b", marginRight: "2rem" }}>{stage.deals} deals</div>
            <div style={{ fontWeight: 700 }}>{stage.amount}</div>
          </div>
        )) : <div style={{ color: "#64748b" }}>No pipeline data</div>}
      </div>
    </div>
  );
}
