import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard, Building2, Users, DollarSign, UserCog, Activity, LogOut } from "lucide-react";
import logoImg from "../pages/logo.png";
import cirrusImg from "../pages/cirruslabs.png";

const Sidebar = (props) => {
  const { isOpen, setIsOpen, activePage, setActivePage } = props;
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "companies", label: "Companies", icon: Building2, path: "/companies" },
    { id: "customers", label: "Customers", icon: Users, path: "/customers" },
    { id: "deals", label: "Deals", icon: DollarSign, path: "/deals" },
    { id: "management", label: "Management", icon: UserCog, path: "/user-management" },
    { id: "activity", label: "Activity", icon: Activity, path: "/activity-log" },
  ];

  const sidebarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    background: "#1e3a8a",
    color: "#fff",
    width: isOpen ? "204px" : "61px",
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 100,
    boxShadow: "2px 0 8px rgba(30, 58, 138, 0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowX: "hidden",
  };

  const toggleButtonStyle = {
    position: "absolute",
    top: "16px",
    right: isOpen ? "16px" : "50%",
    transform: isOpen ? "none" : "translateX(50%)",
    cursor: "pointer",
    color: "#fff",
    background: "transparent",
    border: "none",
    padding: "0.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "6px",
    transition: "background 0.2s",
    zIndex: 101,
  };

  const logoContainerStyle = {
    textAlign: "center",
    marginBottom: isOpen ? "0.5rem" : "1rem",
    width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: isOpen ? "0.5rem" : 0,
  };

  const logoImgStyle = {
    width: isOpen ? "56px" : "40px",
    height: isOpen ? "56px" : "40px",
    borderRadius: "50%",
    transition: "all 0.3s",
  };

  const cirrusImgStyle = {
    width: "140px",
    height: "auto",
    opacity: isOpen ? 1 : 0,
    maxHeight: isOpen ? "100px" : "0",
    transition: "all 0.3s",
    overflow: "hidden",
  };

  const titleStyle = {
    fontSize: "1.25rem",
    fontWeight: "900",
    marginBottom: "1.5rem",
    letterSpacing: "-0.02em",
    textAlign: "center",
    opacity: isOpen ? 1 : 0,
    maxHeight: isOpen ? "100px" : "0",
    overflow: "hidden",
    transition: "all 0.3s",
  };

  const navStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
    padding: "0 0.75rem",
    alignItems: isOpen ? "flex-start" : "center",
  };

  const getNavItemStyle = (itemId) => ({
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.9rem",
    padding: isOpen ? "0.75rem 1rem" : "0.75rem 0.5rem",
    borderRadius: "8px",
    background: activePage === itemId ? "#2563eb" : "#233e8b",
    textAlign: isOpen ? "left" : "center",
    display: "flex",
    alignItems: "center",
    justifyContent: isOpen ? "flex-start" : "center",
    gap: "0.75rem",
    transition: "all 0.2s",
    cursor: "pointer",
    border: "none",
    width: "100%",
  });

  const iconStyle = {
    minWidth: "20px",
    minHeight: "20px",
    display: "block",
  };

  const labelStyle = {
    opacity: isOpen ? 1 : 0,
    maxWidth: isOpen ? "200px" : "0",
    overflow: "hidden",
    whiteSpace: "nowrap",
    transition: "all 0.3s",
  };

  const logoutButtonStyle = {
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.9rem",
    padding: isOpen ? "0.75rem 1rem" : "0.75rem 0.5rem",
    borderRadius: "8px",
    background: "#ef4444",
    border: "none",
    cursor: "pointer",
    marginTop: "0rem",
    marginBottom: "2rem",
    textAlign: isOpen ? "left" : "center",
    width: "calc(100% - 1.5rem)",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: isOpen ? "flex-start" : "center",
    gap: "0.5rem",
  };

  return (
    <aside style={sidebarStyle}>
      <button
        style={toggleButtonStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", height: "100%", marginTop: "1.5cm" }}>
        <div style={{ ...logoContainerStyle, marginBottom: 0 }}>
            <img src={logoImg} alt="Logo" style={logoImgStyle} />
            <img src={cirrusImg} alt="CirrusLabs" style={{ ...cirrusImgStyle, marginTop: 0 }} />
            <div style={{ height: '0.2cm' }} />
        </div>

        <nav style={navStyle}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                style={getNavItemStyle(item.id)}
                onClick={() => setActivePage(item.id)}
                onMouseEnter={(e) => {
                  if (activePage !== item.id) {
                    e.currentTarget.style.background = "#1e40af";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activePage !== item.id) {
                    e.currentTarget.style.background = "#233e8b";
                  }
                }}
              >
                <div
                  style={{
                    width: isOpen ? "auto" : "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%"
                  }}
                >
                  <Icon
                    size={24}
                    style={{
                      ...iconStyle,
                      margin: isOpen ? "0 0.2rem 0 0" : "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  />
                </div>
                <span style={labelStyle}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />
        <button
          style={logoutButtonStyle}
          onClick={() => { setActivePage('dashboard'); navigate('/'); }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
        >
          <LogOut size={20} />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
      );
}

export default Sidebar;