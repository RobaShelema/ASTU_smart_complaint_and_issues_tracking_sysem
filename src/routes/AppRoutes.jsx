import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthLayout from '../components/layout/AuthLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import NewComplaint from '../pages/student/NewComplaint';
import MyComplaints from '../pages/student/MyComplaints';
import ComplaintDetails from '../pages/student/ComplaintDetails';

// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard';
import AssignedComplaints from '../pages/staff/AssignedComplaints';
import ComplaintResolution from '../pages/staff/ComplaintResolution';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageComplaints from '../pages/admin/ManageComplaints';
import ManageUsers from '../pages/admin/ManageUsers';
import Analytics from '../pages/admin/Analytics';

// Components
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Student Routes */}
          <Route path="/student">
            <Route index element={<StudentDashboard />} />
            <Route path="new-complaint" element={<NewComplaint />} />
            <Route path="complaints" element={<MyComplaints />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
          </Route>

          {/* Staff Routes */}
          <Route path="/staff">
            <Route index element={<StaffDashboard />} />
            <Route path="assigned" element={<AssignedComplaints />} />
            <Route path="resolve/:id" element={<ComplaintResolution />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin">
            <Route index element={<AdminDashboard />} />
            <Route path="complaints" element={<ManageComplaints />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Route>

      {/* Default redirect */}
      <Route path="/" element={
        <Navigate to={user ? `/${user.role}` : '/login'} />
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;