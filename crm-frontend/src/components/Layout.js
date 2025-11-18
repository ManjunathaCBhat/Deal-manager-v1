import React from "react";
import Navbar from "./NavBar";

const Layout = ({ children, activePage }) => {
  return (
    <div>
      <Navbar activePage={activePage} />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
