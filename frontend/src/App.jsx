import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import { Toaster } from 'sonner';

// Pages - Import these as you create them
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import CompaniesPage from './pages/CompaniesPage';
import DrivesPage from './pages/DrivesPage';
import MockTestsPage from './pages/MockTestsPage';
import NotificationsPage from './pages/NotificationsPage';
import AIPredictorPage from './pages/AIPredictorPage';
import PrepHubPage from './pages/PrepHubPage';
import CompanyDetailPage from './pages/CompanyDetailPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCompaniesPage from './pages/AdminCompaniesPage';
import AdminCompanyRequestsPage from './pages/AdminCompanyRequestsPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminDrivesPage from './pages/AdminDrivesPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import AdminMockTestsPage from './pages/AdminMockTestsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="dark min-h-screen bg-zinc-950">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes - No Layout */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes with Dashboard Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-predictor"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AIPredictorPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/prep-hub"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PrepHubPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/companies"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CompaniesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/companies/:companyName"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CompanyDetailPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/drives"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DrivesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-tests"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MockTestsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <NotificationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminDashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/companies"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminCompaniesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/company-requests"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminCompanyRequestsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminStudentsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/drives"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminDrivesPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminNotificationsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/mock-tests"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AdminMockTestsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-center" theme="dark" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
