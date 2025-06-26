import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ActivityLogPage from './pages/ActivityLogPage';
import UserManagementPage from './pages/UserManagementPage';
import CompaniesPage from './pages/CompaniesPage';
import DealsPage from './pages/DealsPage';
import DealDetailsPage from './pages/DealDetailsPage';
import CustomersPage from './pages/CustomersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/activity-log" element={<ActivityLogPage />} />
        <Route path="/user-management" element={<UserManagementPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/deal-details" element={<DealDetailsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
