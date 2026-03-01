import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/api/adminService';
import StatsCard from '../../components/common/StatsCard';
import ComplaintsChart from '../../components/charts/ComplaintsChart';
import DepartmentChart from '../../components/charts/DepartmentChart';
import TrendsChart from '../../components/charts/TrendsChart';
import RecentComplaintsTable from '../../components/tables/RecentComplaintsTable';
import QuickActions from '../../components/admin/QuickActions';
import SystemHealth from '../../components/admin/SystemHealth';
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('week');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    activeStaff: 0,
    avgResolutionTime: 0,
    satisfactionRate: 0,
    escalatedCount: 0
  });

  const [complaintTrends, setComplaintTrends] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    memory: 62,
    storage: 38,
    apiLatency: 120
  });

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [
        statsData,
        trendsData,
        deptData,
        catData,
        recentComplaintsData,
        recentUsersData
      ] = await Promise.all([
        adminService.getDashboardStats(dateRange),
        adminService.getComplaintTrends(dateRange),
        adminService.getDepartmentStats(),
        adminService.getCategoryStats(),
        adminService.getRecentComplaints(10),
        adminService.getRecentUsers(5)
      ]);

      setStats(statsData);
      setComplaintTrends(trendsData);
      setDepartmentData(deptData);
      setCategoryData(catData);
      setRecentComplaints(recentComplaintsData);
      setRecentUsers(recentUsersData);

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const handleExportReport = async (format) => {
    try {
      await adminService.exportReport(format, dateRange);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Welcome back, {user?.name}. Here's what's happening with your system.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleExportReport('pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Health Alert */}
      {stats.escalatedCount > 5 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">High Escalation Alert</h3>
            <p className="text-sm text-red-700 mt-1">
              {stats.escalatedCount} complaints have been escalated. Please review the escalated cases.
            </p>
          </div>
          <Link
            to="/admin/complaints?filter=escalated"
            className="ml-auto text-sm font-medium text-red-800 hover:text-red-900"
          >
            View Escalated →
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          trend="+12%"
        />
        <StatsCard
          title="Total Complaints"
          value={stats.totalComplaints}
          icon={FileText}
          color="purple"
          trend="+8%"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingComplaints}
          icon={Clock}
          color="yellow"
          trend="-5%"
        />
        <StatsCard
          title="Resolved"
          value={stats.resolvedComplaints}
          icon={CheckCircle}
          color="green"
          trend="+15%"
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <p className="text-sm text-gray-600">Active Staff</p>
          <p className="text-2xl font-bold text-gray-900">{stats.activeStaff}</p>
          <p className="text-xs text-green-600 mt-1">↑ 3 new this month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Avg. Resolution Time</p>
          <p className="text-2xl font-bold text-gray-900">{stats.avgResolutionTime} days</p>
          <p className="text-xs text-green-600 mt-1">↓ 0.5 days improvement</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Satisfaction Rate</p>
          <p className="text-2xl font-bold text-gray-900">{stats.satisfactionRate}%</p>
          <p className="text-xs text-green-600 mt-1">↑ 2% from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Escalated</p>
          <p className="text-2xl font-bold text-gray-900">{stats.escalatedCount}</p>
          <p className="text-xs text-red-600 mt-1">Needs attention</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Complaint Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Complaint Trends</h2>
            <select className="text-sm border border-gray-300 rounded-lg px-2 py-1">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complaintTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="submitted" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Submitted"
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Resolved"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complaints" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">System Health</h2>
          <SystemHealth metrics={systemMetrics} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <QuickActions />
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Recent Complaints</h2>
          <Link 
            to="/admin/complaints" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View All Complaints →
          </Link>
        </div>
        <div className="p-4">
          <RecentComplaintsTable complaints={recentComplaints} />
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
          <Link 
            to="/admin/users" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Manage Users →
          </Link>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'staff' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.joinedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;