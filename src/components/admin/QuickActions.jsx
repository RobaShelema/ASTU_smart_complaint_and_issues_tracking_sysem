import React from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlus,
  FileText,
  Settings,
  Download,
  Mail,
  Bell,
  Shield,
  Database
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: UserPlus,
      label: 'Add User',
      color: 'blue',
      link: '/admin/users?action=add',
      description: 'Create new user account'
    },
    {
      icon: FileText,
      label: 'New Category',
      color: 'green',
      link: '/admin/categories?action=add',
      description: 'Add complaint category'
    },
    {
      icon: Download,
      label: 'Generate Report',
      color: 'purple',
      link: '/admin/reports',
      description: 'Export system report'
    },
    {
      icon: Mail,
      label: 'Send Broadcast',
      color: 'orange',
      link: '/admin/notifications',
      description: 'Email all users'
    },
    {
      icon: Shield,
      label: 'Backup System',
      color: 'red',
      link: '/admin/settings?tab=backup',
      description: 'Create database backup'
    },
    {
      icon: Settings,
      label: 'System Settings',
      color: 'gray',
      link: '/admin/settings',
      description: 'Configure system'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Link
            key={index}
            to={action.link}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`inline-flex p-2 rounded-lg bg-${action.color}-100 mb-2`}>
              <Icon className={`h-5 w-5 text-${action.color}-600`} />
            </div>
            <p className="text-sm font-medium text-gray-900">{action.label}</p>
            <p className="text-xs text-gray-500 mt-1">{action.description}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;