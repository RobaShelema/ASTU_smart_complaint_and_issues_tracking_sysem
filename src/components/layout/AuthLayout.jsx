import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img src="/astu-logo.png" alt="ASTU" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">ASTU Complaint System</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;