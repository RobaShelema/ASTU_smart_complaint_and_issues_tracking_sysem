import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-5"></div>
        </div>
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-lg mb-4">
            <img 
              src="/astu-logo.png" 
              alt="ASTU" 
              className="h-16 w-16"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/64?text=ASTU';
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            ASTU Smart Complaint System
          </h1>
          <p className="text-blue-100">
            Track, Manage, Resolve - All in One Place
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <Outlet />
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8 text-sm text-blue-200">
          <p>© 2024 Adama Science and Technology University</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Help</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;