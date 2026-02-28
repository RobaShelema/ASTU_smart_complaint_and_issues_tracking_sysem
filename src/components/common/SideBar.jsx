import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/routeConfig';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  LogOut,
  HelpCircle,
  UserPlus,
  Building,
  Tag,
  Activity,
  Download,
  X
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { 
        to: `/${user?.role}/dashboard`, 
        icon: LayoutDashboard, 
        label: 'Dashboard',
        description: 'Overview and stats'
      }
    ];

    const studentItems = [
      { 
        to: '/student/new-complaint', 
        icon: FileText, 
        label: 'New Complaint',
        description: 'Submit a new complaint'
      },
      { 
        to: '/student/complaints', 
        icon: FolderOpen, 
        label: 'My Complaints',
        description: 'Track your complaints',
        badge: '3' // Example: active complaints count
      },
      { 
        to: '/student/history', 
        icon: Clock, 
        label: 'History',
        description: 'View complaint history'
      }
    ];

    const staffItems = [
      { 
        to: '/staff/assigned', 
        icon: Clock, 
        label: 'Assigned to Me',
        description: 'Complaints needing attention',
        badge: '5'
      },
      { 
        to: '/staff/resolved', 
        icon: CheckCircle, 
        label: 'Resolved',
        description: 'Completed complaints'
      },
      { 
        to: '/staff/stats', 
        icon: Activity, 
        label: 'My Statistics',
        description: 'Your performance metrics'
      }
    ];

    const adminItems = [
      { 
        to: '/admin/complaints', 
        icon: AlertCircle, 
        label: 'All Complaints',
        description: 'Manage all complaints'
      },
      { 
        to: '/admin/users', 
        icon: Users, 
        label: 'Users',
        description: 'Manage users and roles',
        badge: 'New'
      },
      { 
        to: '/admin/departments', 
        icon: Building, 
        label: 'Departments',
        description: 'Manage departments'
      },
      { 
        to: '/admin/categories', 
        icon: Tag, 
        label: 'Categories',
        description: 'Complaint categories'
      },
      { 
        to: '/admin/analytics', 
        icon: BarChart3, 
        label: 'Analytics',
        description: 'Reports and insights'
      },
      { 
        to: '/admin/reports', 
        icon: Download, 
        label: 'Reports',
        description: 'Generate reports'
      },
      { 
        to: '/admin/settings', 
        icon: Settings, 
        label: 'Settings',
        description: 'System configuration'
      }
    ];

    switch(user?.role) {
      case 'student':
        return [...commonItems, ...studentItems];
      case 'staff':
        return [...commonItems, ...staffItems];
      case 'admin':
        return [...commonItems, ...adminItems];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">ASTU</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Complaint System</h2>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>
          {/* Close button (mobile) */}
          <button 
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                user?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                user?.role === 'staff' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`h-5 w-5 ${
                  item.label === 'New Complaint' ? 'text-green-500' : ''
                }`} />
                <div>
                  <span className="text-sm font-medium block">{item.label}</span>
                  <span className="text-xs text-gray-400 hidden group-hover:block">
                    {item.description}
                  </span>
                </div>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  item.badge === 'New' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <NavLink
            to="/help"
            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Help & Support</span>
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-1"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>© 2024 ASTU</p>
          <p>All rights reserved</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;