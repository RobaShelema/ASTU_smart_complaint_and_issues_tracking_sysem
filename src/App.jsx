import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatbotProvider } from './context/ChatbotContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

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
import StudentDashboard from './pages/student/StudentDashboard';
import NewComplaint from './pages/student/NewComplaint';
import MyComplaints from './pages/student/MyComplaints';
import ComplaintDetails from './pages/student/ComplaintDetails';
import StudentProfile from './pages/student/StudentProfile';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import AssignedComplaints from './pages/staff/AssignedComplaints';
import ComplaintResolution from './pages/staff/ComplaintResolution';
import StaffProfile from './pages/staff/StaffProfile';

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

// Error Pages
import Unauthorized from './pages/errors/Unauthorized';
import NotFound from './components/common/NotFound';
import RouteErrorHandler from './components/common/RouteErrorHandler';

// Global Components
import Chatbot from './components/chatbot/Chatbot';
import ErrorBoundary from './components/common/ErrorBoundary';

// Route Constants
import { ROUTES } from './routes/routeConfig';

// Styles
import './index.css';

// Combined Providers Component
const AppProviders = ({ children }) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <NotificationProvider>
                <ChatbotProvider>
                  {children}
                </ChatbotProvider>
              </NotificationProvider>
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

// Main App Content with Routes
const AppContent = () => {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            icon: '✅',
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 4000,
            icon: '❌',
            style: {
              background: '#EF4444',
            },
          },
          loading: {
            duration: 5000,
            icon: '⏳',
          },
        }}
      />

      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route element={<PrivateRoute allowedRoles={['student']} />}>
          <Route element={<DashboardLayout />}>
            <Route 
              path={ROUTES.STUDENT_DASHBOARD} 
              element={
                <ErrorBoundary>
                  <StudentDashboard />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.STUDENT_NEW_COMPLAINT} 
              element={
                <ErrorBoundary>
                  <NewComplaint />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.STUDENT_MY_COMPLAINTS} 
              element={
                <ErrorBoundary>
                  <MyComplaints />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.STUDENT_COMPLAINT_DETAIL} 
              element={
                <ErrorBoundary>
                  <ComplaintDetails />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.STUDENT_PROFILE} 
              element={
                <ErrorBoundary>
                  <StudentProfile />
                </ErrorBoundary>
              } 
            />
          </Route>
        </Route>

        {/* Staff Routes */}
        <Route element={<PrivateRoute allowedRoles={['staff']} />}>
          <Route element={<DashboardLayout />}>
            <Route 
              path={ROUTES.STAFF_DASHBOARD} 
              element={
                <ErrorBoundary>
                  <StaffDashboard />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.STAFF_ASSIGNED} 
              element={
                <ErrorBoundary>
                  <AssignedComplaints />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.STAFF_COMPLAINT_DETAIL} 
              element={
                <ErrorBoundary>
                  <ComplaintResolution />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.STAFF_RESOLVE} 
              element={
                <ErrorBoundary>
                  <ComplaintResolution />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.STAFF_PROFILE} 
              element={
                <ErrorBoundary>
                  <StaffProfile />
                </ErrorBoundary>
              } 
            />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route 
              path={ROUTES.ADMIN_DASHBOARD} 
              element={
                <ErrorBoundary>
                  <AdminDashboard />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.ADMIN_COMPLAINTS} 
              element={
                <ErrorBoundary>
                  <ManageComplaints />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.ADMIN_USERS} 
              element={
                <ErrorBoundary>
                  <ManageUsers />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.ADMIN_CATEGORIES} 
              element={
                <ErrorBoundary>
                  <ManageCategories />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.ADMIN_DEPARTMENTS} 
              element={
                <ErrorBoundary>
                  <ManageDepartments />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.ADMIN_ANALYTICS} 
              element={
                <ErrorBoundary>
                  <Analytics />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.ADMIN_REPORTS} 
              element={
                <ErrorBoundary>
                  <Reports />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.ADMIN_LOGS} 
              element={
                <ErrorBoundary>
                  <SystemLogs />
                </ErrorBoundary>
              } 
            />
            <Route 
              path={ROUTES.ADMIN_SETTINGS} 
              element={
                <ErrorBoundary>
                  <Settings />
                </ErrorBoundary>
              } 
            />
          </Route>
        </Route>

        {/* Error Routes */}
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        
        {/* Catch all - redirect to 404 */}
        <Route path="*" element={<RouteErrorHandler />} />
      </Routes>

      {/* Global Chatbot - appears on all pages */}
      <Chatbot />
    </>
  );
};

// Main App Component
function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;