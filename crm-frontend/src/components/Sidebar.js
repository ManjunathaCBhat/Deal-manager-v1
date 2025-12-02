import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  ClipboardList,
  Activity,
  Bell,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../auth/AuthContext";

const Sidebar = ({ activePage }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const sections = [
    {
      title: "MAIN",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { id: "companies", label: "Companies", icon: Building2, path: "/companies" },
        { id: "customers", label: "Customers", icon: Users, path: "/customers" },
        { id: "deals", label: "Deals", icon: Briefcase, path: "/deals" },
        { id: "pipeline", label: "Pipeline", icon: ClipboardList, path: "/pipeline" },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { id: "management", label: "User Management", icon: ClipboardList, path: "/user-management" },
      ],
    },
    {
      title: "ADMINISTRATION",
      items: [
        { id: "activity", label: "Activity Log", icon: Activity, path: "/activity-log" },
      ],
    },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts[0][0] + (parts[1]?.[0] || "");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-screen bg-[#071739] text-white flex flex-col w-64 fixed left-0 top-0 z-50">
      
      {/* TOP BRANDING */}
      <div className="px-4 pt-6">
        <h1 className="text-xl font-bold leading-tight">
          Deal <span className="text-red-400">Management</span>
        </h1>
        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-700 rounded-md">
          v2.0
        </span>
      </div>

      {/* MAIN MENUS */}
      <div className="flex-1 overflow-y-auto px-3 mt-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 mb-2 tracking-wide">
              {sec.title}
            </h3>

            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.id} to={item.path}>
                    <div
                      className={`relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all
                      ${activePage === item.id
                          ? "bg-blue-700 text-white"
                          : "text-gray-300 hover:bg-blue-900 hover:text-white"
                      }`}
                    >
                      {activePage === item.id && (
                        <span className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r-lg"></span>
                      )}
                      <Icon size={18} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* NOTIFICATIONS */}
      <div
        className="mx-3 mb-3 flex items-center gap-3 px-3 py-2 
        text-gray-300 hover:bg-blue-900 hover:text-white rounded-lg transition cursor-pointer"
      >
        <Bell size={18} />
        <span className="text-sm">Notifications</span>
      </div>

      {/* FOOTER USER CARD WITH DROPDOWN */}
      <div className="p-4 relative" ref={menuRef}>
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-[#0D1B50] p-3 rounded-xl flex items-center gap-3 shadow hover:bg-blue-900 transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-sm font-semibold">
            {getInitials(user?.full_name || "User")}
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold leading-none">{user?.full_name}</p>
            <p className="text-xs text-blue-300">{user?.is_staff ? "Administrator" : "User"}</p>
          </div>

          <ChevronDown size={18} className="text-gray-300" />
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute bottom-20 left-4 w-56 bg-white text-black rounded-xl shadow-xl p-4 z-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-sm font-semibold text-white">
                {getInitials(user?.full_name)}
              </div>
              <div>
                <p className="font-semibold">{user?.full_name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

<button
  onClick={() => navigate('/')}
  className="w-full text-left text-red-600 font-medium py-2 px-2 rounded hover:bg-red-50"
>
  Logout
</button>

          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
