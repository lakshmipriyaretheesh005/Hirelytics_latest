import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import CompaniesPage from "./pages/CompaniesPage.tsx";
import DrivesPage from "./pages/DrivesPage.tsx";
import CompanyDetailPage from "./pages/CompanyDetailPage.tsx";
import AIPredictor from "./pages/AIPredictor.tsx";
import PrepHub from "./pages/PrepHub.tsx";
import MockTestsPage from "./pages/MockTestsPage.tsx";
import ContributePage from "./pages/ContributePage.tsx";
import NotificationsPage from "./pages/NotificationsPage.tsx";
import AdminCompaniesPage from "./pages/admin/AdminCompaniesPage.tsx";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage.tsx";
import AdminRequestsPage from "./pages/admin/AdminRequestsPage.tsx";
import AdminContributePage from "./pages/admin/AdminContributePage.tsx";
import AdminDrivesPage from "./pages/admin/AdminDrivesPage.tsx";
import AdminMockTestsPage from "./pages/admin/AdminMockTestsPage.tsx";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute requiredRole="student">
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companies"
              element={
                <ProtectedRoute requiredRole="student">
                  <CompaniesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companies/:id"
              element={
                <ProtectedRoute requiredRole="student">
                  <CompanyDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drives"
              element={
                <ProtectedRoute requiredRole="student">
                  <DrivesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-predictor"
              element={
                <ProtectedRoute requiredRole="student">
                  <AIPredictor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-tests"
              element={
                <ProtectedRoute requiredRole="student">
                  <MockTestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contribute"
              element={
                <ProtectedRoute requiredRole="student">
                  <ContributePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prep-hub"
              element={
                <ProtectedRoute requiredRole="student">
                  <PrepHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/companies" element={<ProtectedRoute requiredRole="admin"><AdminCompaniesPage /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute requiredRole="admin"><AdminStudentsPage /></ProtectedRoute>} />
            <Route path="/admin/requests" element={<ProtectedRoute requiredRole="admin"><AdminRequestsPage /></ProtectedRoute>} />
            <Route path="/admin/contribute" element={<ProtectedRoute requiredRole="admin"><AdminContributePage /></ProtectedRoute>} />
            <Route path="/admin/drives" element={<ProtectedRoute requiredRole="admin"><AdminDrivesPage /></ProtectedRoute>} />
            <Route path="/admin/mock-tests" element={<ProtectedRoute requiredRole="admin"><AdminMockTestsPage /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute requiredRole="admin"><AdminNotificationsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
