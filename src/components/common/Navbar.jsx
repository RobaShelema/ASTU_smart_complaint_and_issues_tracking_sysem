import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/logo192.png" alt="ASTU" className="h-8 w-8" />
            <span className="ml-2 font-bold text-gray-800">ASTU Complaint System</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;