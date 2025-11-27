import React from "react";
import { FaBell } from "react-icons/fa";
import Sidebar from "./Sidebar";

const Layout = ({ children, activePage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(activePage);

  // Page name mapping
  const pageNames = {
    dashboard: "Dashboard",
    companies: "Companies",
    customers: "Customers",
    deals: "Deals",
    management: "Management",
    activity: "Activity Log",
  };
  const pageTitle = pageNames[currentPage] || "";

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>
      <Sidebar
        activePage={currentPage}
        setActivePage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: isSidebarOpen ? 204 : 61,
          transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
          minWidth: 0,
        }}
      >
        {/* Top Header */}
        <header
          style={{
            height: 64,
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            transition: 'padding 0.4s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.02em', margin: 0 }}>{pageTitle}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <FaBell size={22} style={{ color: '#2563eb', cursor: 'pointer', transition: 'color 0.3s' }} />
            <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(30,58,138,0.08)', transition: 'box-shadow 0.3s' }} />
          </div>
        </header>
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', transition: 'padding 0.4s cubic-bezier(.4,0,.2,1)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
