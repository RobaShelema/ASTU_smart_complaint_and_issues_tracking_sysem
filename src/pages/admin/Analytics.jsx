import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api/adminService';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Download,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    avgResolutionTime: 0,
    satisfactionRate: 0,
    activeUsers: 0
  });

  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState([]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [trends, categories, departments, performance] = await Promise.all([
        adminService.getComplaintTrends(dateRange),
        adminService.getCategoryStats(),
        adminService.getDepartmentStats(),
        adminService.getStaffPerformance(dateRange)
      ]);

      setTrendData(trends);
      setCategoryData(categories);
      setDepartmentData(departments);
      setStaffPerformance(performance);

      // Calculate summary stats
      const total = trends.reduce((acc, curr) => acc + curr.submitted, 0);
      const resolved = trends.reduce((acc, curr) => acc + curr.resolved, 0);
      
      setStats({
        totalComplaints: total,
        resolvedComplaints: resolved,
        pendingComplaints: total - resolved,
        avgResolutionTime: 2.5, // This would come from API
        satisfactionRate: 94,
        activeUsers: 156
      });

    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      await adminService.exportReport(format, { dateRange });
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalComplaints}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last period</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {((stats.resolvedComplaints / stats.totalComplaints) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">{stats.resolvedComplaints} resolved</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Resolution Time</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgResolutionTime} days</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↓ 0.5 days improvement</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.satisfactionRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 2% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+15 new this month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingComplaints}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-yellow-600 mt-2">Needs attention</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaint Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Complaint Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
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

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
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
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complaints" fill="#3B82F6" />
              <Bar dataKey="resolved" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Staff</h2>
          <div className="space-y-4">
            {staffPerformance.slice(0, 5).map((staff, index) => (
              <div key={staff.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                    <p className="text-xs text-gray-500">{staff.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{staff.resolved}</p>
                  <p className="text-xs text-gray-500">resolved</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Peak Complaint Hours</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[
            { hour: '00-04', count: 12 },
            { hour: '04-08', count: 8 },
            { hour: '08-12', count: 45 },
            { hour: '12-16', count: 52 },
            { hour: '16-20', count: 38 },
            { hour: '20-24', count: 21 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;