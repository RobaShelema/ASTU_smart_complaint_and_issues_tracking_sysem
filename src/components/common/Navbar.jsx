import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/routeConfig';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const getDashboardLink = () => {
    if (!user) return ROUTES.HOME;
    switch(user.role) {
      case 'student': return ROUTES.STUDENT_DASHBOARD;
      case 'staff': return ROUTES.STAFF_DASHBOARD;
      case 'admin': return ROUTES.ADMIN_DASHBOARD;
      default: return ROUTES.HOME;
    }
  };

  const navLinks = user ? [
    { name: 'Dashboard', path: getDashboardLink() },
    ...(user.role === 'student' ? [
      { name: 'New Complaint', path: ROUTES.STUDENT_NEW_COMPLAINT },
      { name: 'My Complaints', path: ROUTES.STUDENT_MY_COMPLAINTS }
    ] : []),
    ...(user.role === 'staff' ? [
      { name: 'Assigned', path: ROUTES.STAFF_ASSIGNED }
    ] : []),
    ...(user.role === 'admin' ? [
      { name: 'Complaints', path: ROUTES.ADMIN_COMPLAINTS },
      { name: 'Users', path: ROUTES.ADMIN_USERS },
      { name: 'Analytics', path: ROUTES.ADMIN_ANALYTICS }
    ] : [])
  ] : [];

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to={getDashboardLink()} className="flex items-center space-x-2">
              <img src="/astu-logo.png" alt="ASTU" className="h-8 w-8" />
              <span className="font-bold text-gray-800 text-lg hidden sm:block">
                ASTU Complaint System
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User menu and notifications */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <button className="relative p-2 text-gray-600 hover:text-gray-900">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {user.name}
                    </span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <Link
                        to={`/${user.role}/profile`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;