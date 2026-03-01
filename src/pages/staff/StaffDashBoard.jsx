import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import complaintService from '../../services/api/complaintService';
import AssignedComplaintsTable from '../../components/tables/AssignedComplaintsTable';
import StatsCard from '../../components/common/StatsCard';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Calendar,
  Bell,
  FileText,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const StaffDashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  // State management
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    overdue: 0
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  // Colors for charts
  const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

  useEffect(() => {
    fetchAssignedComplaints();
    fetchPerformanceData();
    fetchRecentActivities();
  }, []);

  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getStaffAssigned(user.id);
      setAssignedComplaints(data);
      
      // Calculate stats
      const now = new Date();
      const newStats = {
        totalAssigned: data.length,
        pending: data.filter(c => c.status === 'pending').length,
        inProgress: data.filter(c => c.status === 'in_progress').length,
        resolved: data.filter(c => c.status === 'resolved').length,
        overdue: data.filter(c => {
          const deadline = new Date(c.deadline);
          return deadline < now && c.status !== 'resolved' && c.status !== 'closed';
        }).length
      };
      setStats(newStats);

      // Prepare category data for pie chart
      const categories = {};
      data.forEach(c => {
        categories[c.category] = (categories[c.category] || 0) + 1;
      });
      setCategoryData(
        Object.entries(categories).map(([name, value]) => ({ name, value }))
      );
    } catch (error) {
      toast.error('Failed to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceData = async () => {
    // Mock performance data - replace with API call
    setPerformanceData([
      { day: 'Mon', resolved: 4, assigned: 6 },
      { day: 'Tue', resolved: 3, assigned: 5 },
      { day: 'Wed', resolved: 6, assigned: 7 },
      { day: 'Thu', resolved: 5, assigned: 6 },
      { day: 'Fri', resolved: 7, assigned: 8 },
      { day: 'Sat', resolved: 2, assigned: 3 },
      { day: 'Sun', resolved: 1, assigned: 2 }
    ]);
  };

  const fetchRecentActivities = async () => {
    setRecentActivities([
      {
        id: 1,
        action: 'Resolved complaint',
        complaintId: 'CMP001',
        complaintTitle: 'Broken AC in Lab 101',
        timestamp: '30 minutes ago',
        status: 'resolved'
      },
      {
        id: 2,
        action: 'Updated status',
        complaintId: 'CMP002',
        complaintTitle: 'Internet connectivity issue',
        timestamp: '2 hours ago',
        status: 'in_progress'
      },
      {
        id: 3,
        action: 'Added comment',
        complaintId: 'CMP003',
        complaintTitle: 'Projector not working',
        timestamp: '5 hours ago',
        status: 'pending'
      }
    ]);
  };

  const handleStatusUpdate = async (complaintId, status, remarks) => {
    try {
      await complaintService.updateStatus(complaintId, status, remarks);
      toast.success('Complaint status updated successfully');
      fetchAssignedComplaints();
      
      addNotification({
        type: 'success',
        message: `Complaint #${complaintId} status updated to ${status}`
      });
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleResolveComplaint = async (resolutionData) => {
    try {
      await complaintService.resolveComplaint(selectedComplaint.id, resolutionData);
      setShowResolutionModal(false);
      setSelectedComplaint(null);
      toast.success('Complaint resolved successfully');
      fetchAssignedComplaints();
    } catch (error) {
      toast.error('Failed to resolve complaint');
    }
  };

  // Calculate performance metrics
  const averageResolutionTime = performanceData.reduce((acc, curr) => acc + curr.resolved, 0) / 
    performanceData.filter(d => d.resolved > 0).length || 0;
  
  const resolutionRate = stats.totalAssigned > 0 
    ? ((stats.resolved / stats.totalAssigned) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl shadow-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-green-100 mt-1 text-sm sm:text-base">
              Manage and resolve assigned complaints efficiently
            </p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 text-center sm:text-right">
            <p className="text-sm opacity-90">Your Performance</p>
            <p className="text-2xl font-bold">{resolutionRate}%</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatsCard
          title="Total Assigned"
          value={stats.totalAssigned}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={AlertCircle}
          color="orange"
        />
        <StatsCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="assigned" 
                stackId="1" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.3}
                name="Assigned"
              />
              <Area 
                type="monotone" 
                dataKey="resolved" 
                stackId="2" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Resolved"
              />
            </AreaChart>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Assigned Complaints Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Assigned Complaints</h2>
            <Link 
              to="/staff/assigned" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>
          </div>
          <div className="p-4">
            <AssignedComplaintsTable
              complaints={assignedComplaints.slice(0, 5)}
              loading={loading}
              onStatusUpdate={handleStatusUpdate}
              onResolve={(complaint) => {
                setSelectedComplaint(complaint);
                setShowResolutionModal(true);
              }}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Resolution Time</span>
                <span className="text-sm font-semibold text-gray-900">
                  {averageResolutionTime.toFixed(1)} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolution Rate</span>
                <span className="text-sm font-semibold text-gray-900">{resolutionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Efficiency Score</span>
                <span className="text-sm font-semibold text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${resolutionRate}%` }}></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                      activity.status === 'resolved' ? 'bg-green-400' :
                      activity.status === 'in_progress' ? 'bg-blue-400' :
                      'bg-yellow-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {activity.complaintTitle}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
            </div>
            <div className="p-4">
              {assignedComplaints
                .filter(c => c.status !== 'resolved' && c.status !== 'closed')
                .slice(0, 3)
                .map(complaint => (
                  <div key={complaint.id} className="mb-3 last:mb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">#{complaint.id}</span>
                      <span className="text-xs text-red-600">
                        Due {new Date(complaint.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{complaint.title}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && selectedComplaint && (
        <ResolutionModal
          complaint={selectedComplaint}
          onClose={() => {
            setShowResolutionModal(false);
            setSelectedComplaint(null);
          }}
          onSubmit={handleResolveComplaint}
        />
      )}
    </div>
  );
};

export default StaffDashboard;