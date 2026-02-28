import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { user } = useAuth();

  // Redirect authenticated users to their respective dashboards
  if (user) {
    const dashboardRoute = `/${user.role}`;
    return <Navigate to={dashboardRoute} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;