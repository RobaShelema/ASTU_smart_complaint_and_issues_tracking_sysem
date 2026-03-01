import React, { useState, useEffect } from 'react';
import adminService from '../../services/api/adminService';
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  PieChart,
  Activity,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [trends, setTrends] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [trendData, deptData, catData, statsData] = await Promise.all([
        adminService.getComplaintTrends(dateRange),
        adminService.getDepartmentStats(),
        adminService.getCategoryStats(),
        adminService.getDashboardStats(dateRange),
      ]);
      setTrends(Array.isArray(trendData) ? trendData : []);
      setDepartmentStats(Array.isArray(deptData) ? deptData : []);
      setCategoryStats(Array.isArray(catData) ? catData : []);
      setDashboardStats(statsData && typeof statsData === 'object' ? statsData : {});
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    { label: 'Total Complaints', value: dashboardStats.totalComplaints ?? 0, change: '+12%', up: true, icon: BarChart2, color: 'blue' },
    { label: 'Resolution Rate', value: `${dashboardStats.satisfactionRate ?? 0}%`, change: '+3%', up: true, icon: TrendingUp, color: 'green' },
    { label: 'Avg Resolution Time', value: `${dashboardStats.avgResolutionTime ?? 0}d`, change: '-0.5d', up: true, icon: Activity, color: 'purple' },
    { label: 'Escalated', value: dashboardStats.escalatedCount ?? 0, change: '-2', up: true, icon: TrendingDown, color: 'red' },
  ];

  const colorMap = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', purple: 'bg-purple-100 text-purple-600', red: 'bg-red-100 text-red-600' };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Insights and trends for the complaint system</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${colorMap[card.color]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`flex items-center text-xs font-medium ${card.up ? 'text-green-600' : 'text-red-600'}`}>
                  {card.up ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                  {card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Trends Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Complaint Trends</h2>
        {trends.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="submitted" stroke="#3B82F6" fill="#3B82F680" name="Submitted" />
              <Area type="monotone" dataKey="resolved" stroke="#10B981" fill="#10B98180" name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-12">No trend data available</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">By Department</h2>
          {departmentStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="complaints" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                  {departmentStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No department data available</p>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">By Category</h2>
          {categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie data={categoryStats} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No category data available</p>
          )}
        </div>
      </div>

      {/* Resolution Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Resolution Performance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Pending', count: dashboardStats.pendingComplaints ?? 0, color: 'text-yellow-600 bg-yellow-50' },
            { label: 'In Progress', count: dashboardStats.totalComplaints ? (dashboardStats.totalComplaints - (dashboardStats.pendingComplaints ?? 0) - (dashboardStats.resolvedComplaints ?? 0)) : 0, color: 'text-blue-600 bg-blue-50' },
            { label: 'Resolved', count: dashboardStats.resolvedComplaints ?? 0, color: 'text-green-600 bg-green-50' },
            { label: 'Active Staff', count: dashboardStats.activeStaff ?? 0, color: 'text-purple-600 bg-purple-50' },
          ].map((item) => (
            <div key={item.label} className={`rounded-lg p-4 text-center ${item.color}`}>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-sm mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
