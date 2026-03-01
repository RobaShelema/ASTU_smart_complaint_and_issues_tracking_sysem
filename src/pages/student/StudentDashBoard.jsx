import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import complaintService from '../../services/api/complaintService';
import ComplaintForm from '../../components/forms/ComplaintForm';
import ComplaintTable from '../../components/tables/ComplaintTable';
import Chatbot from '../../components/chatbot/Chatbot';
import StatsCard from '../../components/common/StatsCard';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  // State management
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch student complaints
  useEffect(() => {
    fetchComplaints();
    fetchRecentActivities();
    fetchNotifications();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getStudentComplaints(user.id);
      setComplaints(data);
      
      // Calculate stats
      const newStats = {
        total: data.length,
        pending: data.filter(c => c.status === 'pending').length,
        inProgress: data.filter(c => c.status === 'in_progress').length,
        resolved: data.filter(c => c.status === 'resolved').length,
        closed: data.filter(c => c.status === 'closed').length
      };
      setStats(newStats);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    // Mock recent activities - replace with API call
    setRecentActivities([
      {
        id: 1,
        action: 'Complaint submitted',
        complaintId: 'CMP001',
        timestamp: '2 hours ago',
        status: 'pending'
      },
      {
        id: 2,
        action: 'Status updated',
        complaintId: 'CMP002',
        timestamp: '5 hours ago',
        status: 'in_progress'
      },
      {
        id: 3,
        action: 'Complaint resolved',
        complaintId: 'CMP003',
        timestamp: '1 day ago',
        status: 'resolved'
      }
    ]);
  };

  const fetchNotifications = async () => {
    // Mock notifications - replace with API call
    setNotifications([
      {
        id: 1,
        message: 'Your complaint #CMP001 has been assigned',
        timestamp: '1 hour ago',
        read: false
      },
      {
        id: 2,
        message: 'New comment on complaint #CMP002',
        timestamp: '3 hours ago',
        read: true
      }
    ]);
  };

  const handleNewComplaint = async (complaintData) => {
    try {
      await complaintService.create(complaintData);
      toast.success('Complaint submitted successfully!');
      setShowComplaintForm(false);
      fetchComplaints();
      
      // Add notification
      addNotification({
        type: 'success',
        message: 'Your complaint has been submitted successfully'
      });
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">
              Track and manage your complaints from one central dashboard
            </p>
          </div>
          <button
            onClick={() => setShowComplaintForm(true)}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            <span>New Complaint</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatsCard
          title="Total Complaints"
          value={stats.total}
          icon={FileText}
          color="blue"
          trend="+12%"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="yellow"
          trend="-5%"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={AlertCircle}
          color="orange"
          trend="+8%"
        />
        <StatsCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle}
          color="green"
          trend="+23%"
        />
        <StatsCard
          title="Closed"
          value={stats.closed}
          icon={CheckCircle}
          color="gray"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Complaints Table */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Recent Complaints */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Complaints</h2>
            </div>
            <div className="p-4 overflow-x-auto">
              <ComplaintTable 
                complaints={complaints.slice(0, 5)} 
                loading={loading}
                onViewAll={() => {}}
              />
              {complaints.length > 5 && (
                <div className="mt-4 text-center">
                  <Link 
                    to="/student/complaints" 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Complaints →
                  </Link>
                </div>
              )}
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
                      activity.status === 'pending' ? 'bg-yellow-400' :
                      activity.status === 'in_progress' ? 'bg-blue-400' :
                      'bg-green-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Complaint #{activity.complaintId} • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Notifications & Quick Actions */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => setShowComplaintForm(true)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                📝 Submit New Complaint
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                📊 View Analytics
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                📞 Contact Support
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                ❓ FAQ & Help
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>No upcoming deadlines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Submit New Complaint</h2>
                <button
                  onClick={() => setShowComplaintForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <ComplaintForm 
                onSubmit={handleNewComplaint}
                onCancel={() => setShowComplaintForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
};

export default StudentDashboard;