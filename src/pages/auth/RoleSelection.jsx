import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Shield, ArrowRight } from 'lucide-react';

const roles = [
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,
    color: 'blue',
    description: 'Submit and track complaints about campus facilities, services, and more.',
    gradient: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    hover: 'hover:border-blue-400 hover:shadow-blue-100',
  },
  {
    id: 'staff',
    label: 'Staff',
    icon: Briefcase,
    color: 'emerald',
    description: 'Manage and resolve complaints assigned to your department.',
    gradient: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    hover: 'hover:border-emerald-400 hover:shadow-emerald-100',
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: Shield,
    color: 'violet',
    description: 'Full system access — manage users, departments, and oversee all operations.',
    gradient: 'from-violet-500 to-violet-700',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-200 dark:border-violet-800',
    hover: 'hover:border-violet-400 hover:shadow-violet-100',
  },
];

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            ASTU Complaint System
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Select your role to sign in
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => navigate(`/login/${role.id}`)}
                className={`group relative flex flex-col items-center text-center rounded-2xl border-2 ${role.border} ${role.bg} ${role.hover} p-6 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer`}
              >
                <div className={`flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br ${role.gradient} text-white mb-4 shadow-lg`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {role.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  {role.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
