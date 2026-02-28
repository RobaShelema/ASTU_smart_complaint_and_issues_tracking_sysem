import React from 'react';
import { NavLink } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const studentLinks = [
    { to: ROUTES.STUDENT_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { to: ROUTES.STUDENT_NEW_COMPLAINT, icon: FileText, label: 'New Complaint' },
    { to: ROUTES.STUDENT_MY_COMPLAINTS, icon: FolderOpen, label: 'My Complaints' },
  ];

  const staffLinks = [
    { to: ROUTES.STAFF_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { to: ROUTES.STAFF_ASSIGNED, icon: Clock, label: 'Assigned to Me' },
  ];

  const adminLinks = [
    { to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { to: ROUTES.ADMIN_COMPLAINTS, icon: AlertCircle, label: 'All Complaints' },
    { to: ROUTES.ADMIN_USERS, icon: Users, label: 'Users' },
    { to: ROUTES.ADMIN_CATEGORIES, icon: FolderOpen, label: 'Categories' },
    { to: ROUTES.ADMIN_ANALYTICS, icon: BarChart3, label: 'Analytics' },
    { to: ROUTES.ADMIN_SETTINGS, icon: Settings, label: 'Settings' },
  ];

  const getLinks = () => {
    switch(user?.role) {
      case 'student': return studentLinks;
      case 'staff': return staffLinks;
      case 'admin': return adminLinks;
      default: return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">ASTU System</h2>
          <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
        </div>

        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </NavLink>
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-8"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;