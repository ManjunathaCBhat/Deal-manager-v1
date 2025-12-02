import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children, activePage }) => {
  return (
    <div className="flex bg-[#f9fafb] min-h-screen">

      {/* Sidebar stays fixed */}
      <Sidebar activePage={activePage} />

      {/* Content shifted right */}
      <div className="flex-1 ml-64 p-8">
        {children}
      </div>

    </div>
  );
};

export default Layout;
