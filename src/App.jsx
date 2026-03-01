import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatbotProvider } from './context/ChatbotContext';

// Layout Components
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

// Route Guards
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Student Pages
import StudentDashBoard from './pages/student/StudentDashBoard';
import NewComplaint from './pages/student/NewComplaint';
import MyComplaints from './pages/student/MyComplaints';
import ComplaintDetails from './pages/student/ComplaintDetails';
import StudentProfile from './pages/student/StudentProfile';
import ComplaintHistory from './pages/student/ComplaintHistory';

// Staff Pages
import StaffDashBoard from './pages/staff/StaffDashBoard';
import AssignedComplaints from './pages/staff/AssignedComplaints';
import ComplaintResolution from './pages/staff/ComplaintResolution';
import StaffProfile from './pages/staff/StaffProfile';
import ResolvedComplaints from './pages/staff/ResolvedComplaints';
import StaffStats from './pages/staff/StaffStats';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/ManageCategories';
import ManageDepartments from './pages/admin/ManageDepartments';
import Analytics from './pages/admin/Analytics';
import Reports from './pages/admin/Reports';
import SystemLogs from './pages/admin/SystemLogs';
import Settings from './pages/admin/Settings';
import ManageComplaints from './pages/admin/ManageComplaints';

// Common Pages
import HelpSupport from './pages/common/HelpSupport';

// Error Pages
import Unauthorized from './pages/errors/Unauthorized';
import NotFound from './components/common/NotFound';
import ErrorBoundary from './components/common/ErrorBoundary';

// Styles
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
            <ChatbotProvider>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />

              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                
                <Route element={<PublicRoute />}>
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Route>
                </Route>

                {/* Student Routes */}
                <Route element={<PrivateRoute allowedRoles={['student']} />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/student/dashboard" element={<StudentDashBoard />} />
                    <Route path="/student/new-complaint" element={<NewComplaint />} />
                    <Route path="/student/complaints" element={<MyComplaints />} />
                    <Route path="/student/complaints/:id" element={<ComplaintDetails />} />
                    <Route path="/student/history" element={<ComplaintHistory />} />
                    <Route path="/student/profile" element={<StudentProfile />} />
                    <Route path="/help" element={<HelpSupport />} />
                  </Route>
                </Route>

                {/* Staff Routes */}
                <Route element={<PrivateRoute allowedRoles={['staff']} />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/staff/dashboard" element={<StaffDashBoard />} />
                    <Route path="/staff/assigned" element={<AssignedComplaints />} />
                    <Route path="/staff/complaints/:id" element={<ComplaintResolution />} />
                    <Route path="/staff/resolve/:id" element={<ComplaintResolution />} />
                    <Route path="/staff/resolved" element={<ResolvedComplaints />} />
                    <Route path="/staff/stats" element={<StaffStats />} />
                    <Route path="/staff/profile" element={<StaffProfile />} />
                    <Route path="/help" element={<HelpSupport />} />
                  </Route>
                </Route>

                {/* Admin Routes */}
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/complaints" element={<ManageComplaints />} />
                    <Route path="/admin/users" element={<ManageUsers />} />
                    <Route path="/admin/categories" element={<ManageCategories />} />
                    <Route path="/admin/departments" element={<ManageDepartments />} />
                    <Route path="/admin/analytics" element={<Analytics />} />
                    <Route path="/admin/reports" element={<Reports />} />
                    <Route path="/admin/logs" element={<SystemLogs />} />
                    <Route path="/admin/settings" element={<Settings />} />
                    <Route path="/help" element={<HelpSupport />} />
                  </Route>
                </Route>

                {/* Error Routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/404" element={<NotFound />} />
                
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </ChatbotProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;