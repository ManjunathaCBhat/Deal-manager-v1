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
            
              <Layout activePage="dashboard">
                <DashboardPage />
              </Layout>
            
          } />

          <Route path="/activity-log" element={
           
              <Layout activePage="activity-log">
                <ActivityLogPage />
              </Layout>
            
          } />

          <Route path="/user-management" element={
            
              <Layout activePage="user-management">
                <UserManagementPage />
              </Layout>
            
          } />

          <Route path="/companies" element={
            
              <Layout activePage="companies">
                <CompaniesPage />
              </Layout>
           
          } />

          <Route path="/deals" element={
            
              <Layout activePage="deals">
                <DealsPage />
              </Layout>
           
          } />

          <Route path="/deal-details/:id" element={
           
              <Layout activePage="deals">
                <DealDetailsPage />
              </Layout>
            
          } />

          <Route path="/deals/edit/:id" element={
           
              <Layout activePage="deals">
                <EditDealPage />
              </Layout>
            
          } />

          <Route path="/customers" element={
         
              <Layout activePage="customers">
                <CustomersPage />
              </Layout>
          
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
