import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Shield, ArrowRight, Star } from 'lucide-react';

const roles = [
  {
    id: 'student',
    label: 'Student',
    icon: GraduationCap,
    description: 'Submit and track complaints about campus facilities, services, and more.',
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    glowFrom: 'from-blue-400/20',
    glowTo: 'to-indigo-400/20',
    ring: 'ring-blue-500/30',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600',
    tagBg: 'bg-blue-50 text-blue-700 border-blue-200',
    tag: 'Most Popular',
  },
  {
    id: 'staff',
    label: 'Staff',
    icon: Briefcase,
    description: 'Manage and resolve complaints assigned to your department efficiently.',
    gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
    glowFrom: 'from-emerald-400/20',
    glowTo: 'to-teal-400/20',
    ring: 'ring-emerald-500/30',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tag: 'Department',
  },
  {
    id: 'admin',
    label: 'Administrator',
    icon: Shield,
    description: 'Full system access — manage users, departments, and oversee all operations.',
    gradient: 'from-violet-500 via-purple-600 to-fuchsia-600',
    glowFrom: 'from-violet-400/20',
    glowTo: 'to-fuchsia-400/20',
    ring: 'ring-violet-500/30',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
    tagBg: 'bg-violet-50 text-violet-700 border-violet-200',
    tag: 'Full Access',
  },
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/20 dark:bg-emerald-900/10 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Logo & Header */}
        <div className="text-center mb-12 max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/25 mb-6">
            <Star className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            ASTU Complaint System
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium">
            Smart complaint tracking for a better campus experience
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-8 rounded-full bg-blue-500" />
            <div className="h-1 w-3 rounded-full bg-indigo-400" />
            <div className="h-1 w-2 rounded-full bg-violet-400" />
          </div>
        </div>

        {/* Role Selection Label */}
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          Choose your role to continue
        </p>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 w-full max-w-4xl">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isHovered = hoveredRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => navigate(`/login/${role.id}`)}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                className="group relative cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow effect on hover */}
                <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${role.glowFrom} ${role.glowTo} blur-xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                {/* Card */}
                <div className={`relative flex flex-col items-center text-center rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-7 sm:p-8 transition-all duration-300 ${isHovered ? `shadow-2xl shadow-gray-300/40 dark:shadow-black/40 -translate-y-1 ring-2 ${role.ring}` : 'shadow-lg shadow-gray-200/50 dark:shadow-black/30'}`}>
                  {/* Tag */}
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${role.tagBg} transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    {role.tag}
                  </span>

                  {/* Icon */}
                  <div className={`relative flex items-center justify-center w-16 h-16 rounded-2xl ${role.iconBg} mb-5 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                    <Icon className={`h-8 w-8 ${role.iconColor} transition-all duration-300`} />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.gradient} opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`} />
                    <Icon className={`absolute h-8 w-8 text-white opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {role.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 min-h-[3rem]">
                    {role.description}
                  </p>

                  {/* CTA Button */}
                  <div className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${isHovered ? `bg-gradient-to-r ${role.gradient} text-white shadow-lg` : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                    <span>Sign In</span>
                    <ArrowRight className={`h-4 w-4 transition-all duration-300 ${isHovered ? 'translate-x-0.5' : ''}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Links */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-violet-700 transition-all">
              Create one for free
            </Link>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Adama Science and Technology University
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
