import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBell from '../feedback/NotificationBell';
import MobileMenu from '../layout/MobileMenu';
import { 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  HelpCircle,
  ChevronDown,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, effectiveTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getThemeIcon = () => {
    if (effectiveTheme === 'dark') return <Moon className="h-5 w-5" />;
    if (effectiveTheme === 'light') return <Sun className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  const navLinks = user ? [
    { to: `/${user.role}/dashboard`, label: 'Dashboard' },
    ...(user.role === 'student' ? [
      { to: '/student/new-complaint', label: 'New Complaint' },
      { to: '/student/complaints', label: 'My Complaints' },
    ] : []),
    ...(user.role === 'staff' ? [
      { to: '/staff/assigned', label: 'Assigned' },
    ] : []),
    ...(user.role === 'admin' ? [
      { to: '/admin/complaints', label: 'Complaints' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/analytics', label: 'Analytics' },
    ] : []),
  ] : [];

  return (
    <nav className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-[rgb(var(--bg-primary))] bg-opacity-90 backdrop-blur-lg shadow-soft' 
        : 'bg-[rgb(var(--bg-primary))]'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="gradient-primary h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-[rgb(var(--text-primary))] hidden sm:block">
              ASTU Complaint System
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="nav-link nav-link-inactive"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[rgb(var(--bg-secondary))] transition-colors"
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* Profile Dropdown - Desktop */}
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[rgb(var(--bg-secondary))] transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-white font-medium">
                      {getInitials(user.name)}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isProfileOpen && (
                    <div className="dropdown right-0 mt-2">
                      <Link
                        to={`/${user.role}/profile`}
                        className="dropdown-item"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to={`/${user.role}/settings`}
                        className="dropdown-item"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item w-full text-left text-[rgb(var(--color-danger))]"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu */}
                <MobileMenu>
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-[rgb(var(--bg-secondary))] rounded-lg">
                      <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-medium">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-[rgb(var(--text-secondary))] capitalize">{user.role}</p>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className="nav-link nav-link-inactive w-full"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-[rgb(var(--border-color))] space-y-1">
                      <Link to={`/${user.role}/profile`} className="dropdown-item">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link to={`/${user.role}/settings`} className="dropdown-item">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <Link to="/help" className="dropdown-item">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Help
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item w-full text-left text-[rgb(var(--color-danger))]"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </MobileMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="btn-ghost"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;