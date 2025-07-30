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
import EditDealPage from './pages/EditDealPage';
import PrivateRoute from './auth/PrivateRoute';
import { AuthProvider } from './auth/AuthContext';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/activity-log" element={<PrivateRoute><ActivityLogPage /></PrivateRoute>} />
          <Route path="/user-management" element={<PrivateRoute><UserManagementPage /></PrivateRoute>} />
          <Route path="/companies" element={<PrivateRoute><CompaniesPage /></PrivateRoute>} />
          <Route path="/deals" element={<PrivateRoute><DealsPage /></PrivateRoute>} />
          <Route path="/deal-details/:id" element={<PrivateRoute><DealDetailsPage /></PrivateRoute>} />
          <Route path="/deals/edit/:id" element={<PrivateRoute><EditDealPage /></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
