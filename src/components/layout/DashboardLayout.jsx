import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/SideBar';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBell from '../feedback/NotificationBell';
import { Sun, Moon, Monitor, LogOut, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { effectiveTheme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileOpen && !e.target.closest('.profile-dropdown')) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const getThemeIcon = () => {
    if (effectiveTheme === 'dark') return <Moon className="h-5 w-5" />;
    if (effectiveTheme === 'light') return <Sun className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  const getInitials = (name) =>
    name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-20 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar -- always fixed, slides in on mobile */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen && isMobile ? 'translate-x-0' : isMobile ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main area -- offset by sidebar width on desktop */}
      <div className="flex flex-col min-h-screen md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Left: hamburger + page context */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">
                Welcome, {user?.name?.split(' ')[0] || 'User'}
              </h2>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {getThemeIcon()}
              </button>

              <NotificationBell />

              {/* Profile dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(user?.name)}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to={`/${user?.role}/profile`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <button
                      onClick={() => { setProfileOpen(false); logout(); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} ASTU Smart Complaint System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
