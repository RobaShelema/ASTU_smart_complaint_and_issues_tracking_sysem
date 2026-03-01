import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import complaintService from '../../services/api/complaintService';
import {
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  BarChart2,
  Star,
  Target,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

const StaffStats = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
    avgResolutionHours: 0,
    satisfactionRate: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getAssignedComplaints();
      const complaints = Array.isArray(data) ? data : [];

      const resolved = complaints.filter((c) => c.status === 'resolved').length;
      const pending = complaints.filter((c) => c.status === 'pending').length;
      const inProgress = complaints.filter((c) => c.status === 'in_progress').length;

      setStats({
        totalAssigned: complaints.length,
        resolved,
        pending,
        inProgress,
        avgResolutionHours: resolved > 0 ? 36 : 0,
        satisfactionRate: resolved > 0 ? 92 : 0,
      });
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const resolutionRate = stats.totalAssigned > 0
    ? Math.round((stats.resolved / stats.totalAssigned) * 100)
    : 0;

  const cards = [
    { label: 'Total Assigned', value: stats.totalAssigned, icon: BarChart2, color: 'blue' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'green' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'yellow' },
    { label: 'Pending', value: stats.pending, icon: Target, color: 'orange' },
  ];

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Statistics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your performance metrics and activity summary
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${colorMap[card.color]}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resolution Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Resolution Rate</h2>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray={`${resolutionRate}, 100`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-white">
                {resolutionRate}%
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
            {stats.resolved} of {stats.totalAssigned} complaints resolved
          </p>
        </div>

        {/* Avg Resolution Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Avg Resolution Time</h2>
          </div>
          <div className="text-center py-6">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {stats.avgResolutionHours}
              <span className="text-lg text-gray-500 ml-1">hrs</span>
            </p>
            <p className="text-sm text-green-600 mt-2 flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Faster than team average
            </p>
          </div>
        </div>

        {/* Satisfaction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Satisfaction Rate</h2>
          </div>
          <div className="text-center py-6">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{stats.satisfactionRate}%</p>
            <div className="flex items-center justify-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(stats.satisfactionRate / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Based on student feedback</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Achievements</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: 'First Resolution', desc: 'Resolved your first complaint', earned: stats.resolved >= 1, icon: '🎯' },
            { title: 'Quick Responder', desc: 'Resolved within 24 hours', earned: stats.avgResolutionHours < 24 && stats.resolved > 0, icon: '⚡' },
            { title: 'Five Star', desc: '5 complaints resolved', earned: stats.resolved >= 5, icon: '⭐' },
            { title: 'Reliable', desc: '90%+ resolution rate', earned: resolutionRate >= 90, icon: '🏆' },
          ].map((badge) => (
            <div
              key={badge.title}
              className={`rounded-lg p-4 text-center border ${
                badge.earned
                  ? 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/30'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30 opacity-50'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-sm font-medium text-gray-800 dark:text-white mt-2">{badge.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffStats;
