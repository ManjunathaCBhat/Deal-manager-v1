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
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout activePage="dashboard">
                <DashboardPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/activity-log" element={
            <PrivateRoute>
              <Layout activePage="activity-log">
                <ActivityLogPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/user-management" element={
            <PrivateRoute>
              <Layout activePage="user-management">
                <UserManagementPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/companies" element={
            <PrivateRoute>
              <Layout activePage="companies">
                <CompaniesPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/deals" element={
            <PrivateRoute>
              <Layout activePage="deals">
                <DealsPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/deal-details/:id" element={
            <PrivateRoute>
              <Layout activePage="deals">
                <DealDetailsPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/deals/edit/:id" element={
            <PrivateRoute>
              <Layout activePage="deals">
                <EditDealPage />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/customers" element={
            <PrivateRoute>
              <Layout activePage="customers">
                <CustomersPage />
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
