import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ChatbotProvider } from './context/ChatbotContext';

// Layout Components
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

// Route Guards
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Student Pages
import StudentDashboard from './pages/student/StudentDashBoard';
import NewComplaint from './pages/student/NewComplaint';
import MyComplaints from './pages/student/MyComplaints';
import ComplaintDetails from './pages/student/ComplaintDetails';
import StudentProfile from './pages/student/StudentProfile';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashBoard';
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

// Global Components
import Chatbot from './components/chatbot/Chatbot';
import ErrorBoundary from './components/common/ErrorBoundary';
import Loader from './components/common/Loader';

// Route Constants
import { ROUTES } from './routes/routeConfig';

// Styles
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <ChatbotProvider>
              {/* Toast Notifications */}
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

              {/* Routes Configuration */}
              <Routes>
                {/* ========== PUBLIC ROUTES ========== */}
                <Route element={<PublicRoute />}>
                  <Route element={<AuthLayout />}>
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.REGISTER} element={<Register />} />
                    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
                  </Route>
                </Route>

                {/* ========== STUDENT ROUTES ========== */}
                <Route element={<PrivateRoute allowedRoles={['student']} />}>
                  <Route element={<DashboardLayout />}>
                    <Route path={ROUTES.STUDENT_DASHBOARD} element={<StudentDashboard />} />
                    <Route path={ROUTES.STUDENT_NEW_COMPLAINT} element={<NewComplaint />} />
                    <Route path={ROUTES.STUDENT_MY_COMPLAINTS} element={<MyComplaints />} />
                    <Route path={ROUTES.STUDENT_COMPLAINT_DETAIL} element={<ComplaintDetails />} />
                    <Route path={ROUTES.STUDENT_PROFILE} element={<StudentProfile />} />
                  </Route>
                </Route>

                {/* ========== STAFF ROUTES ========== */}
                <Route element={<PrivateRoute allowedRoles={['staff']} />}>
                  <Route element={<DashboardLayout />}>
                    <Route path={ROUTES.STAFF_DASHBOARD} element={<StaffDashboard />} />
                    <Route path={ROUTES.STAFF_ASSIGNED} element={<AssignedComplaints />} />
                    <Route path={ROUTES.STAFF_COMPLAINT_DETAIL} element={<ComplaintResolution />} />
                    <Route path={ROUTES.STAFF_RESOLVE} element={<ComplaintResolution />} />
                    <Route path={ROUTES.STAFF_PROFILE} element={<StaffProfile />} />
                  </Route>
                </Route>

                {/* ========== ADMIN ROUTES ========== */}
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route element={<DashboardLayout />}>
                    <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
                    <Route path={ROUTES.ADMIN_COMPLAINTS} element={<ManageComplaints />} />
                    <Route path={ROUTES.ADMIN_USERS} element={<ManageUsers />} />
                    <Route path={ROUTES.ADMIN_CATEGORIES} element={<ManageCategories />} />
                    <Route path={ROUTES.ADMIN_DEPARTMENTS} element={<ManageDepartments />} />
                    <Route path={ROUTES.ADMIN_ANALYTICS} element={<Analytics />} />
                    <Route path={ROUTES.ADMIN_REPORTS} element={<Reports />} />
                    <Route path={ROUTES.ADMIN_LOGS} element={<SystemLogs />} />
                    <Route path={ROUTES.ADMIN_SETTINGS} element={<Settings />} />
                  </Route>
                </Route>

                {/* ========== ERROR ROUTES ========== */}
                <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
                <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
                
                {/* ========== ROOT REDIRECT ========== */}
                <Route 
                  path="/" 
                  element={
                    <Navigate to={ROUTES.LOGIN} replace />
                  } 
                />
                
                {/* ========== CATCH ALL ========== */}
                <Route 
                  path="*" 
                  element={
                    <Navigate to={ROUTES.NOT_FOUND} replace />
                  } 
                />
              </Routes>

              {/* Global Chatbot Component */}
              <Chatbot />
            </ChatbotProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;