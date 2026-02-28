import React, { useState, useEffect } from 'react';
import adminService from '../../services/api/adminService';
import ComplaintTable from '../../components/tables/ComplaintTable';
import StatusFilter from '../../components/common/StatusFilter';
import {
  Filter,
  Download,
  Search,
  Calendar,
  User,
  Building,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaints, setSelectedComplaints] = useState([]);
  const [filters, setFilters] = useState({
    status: [],
    priority: 'all',
    department: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    escalated: 0
  });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('assign');

  useEffect(() => {
    fetchComplaints();
  }, [filters]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllComplaints(filters);
      setComplaints(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        pending: data.filter(c => c.status === 'pending').length,
        inProgress: data.filter(c => c.status === 'in_progress').length,
        resolved: data.filter(c => c.status === 'resolved').length,
        escalated: data.filter(c => c.status === 'escalated').length
      });
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async () => {
    try {
      await adminService.bulkComplaintAction(selectedComplaints, bulkAction);
      toast.success(`Bulk ${bulkAction} completed successfully`);
      setSelectedComplaints([]);
      setShowBulkModal(false);
      fetchComplaints();
    } catch (error) {
      toast.error(`Failed to perform bulk ${bulkAction}`);
    }
  };

  const handleExport = async (format) => {
    try {
      await adminService.exportComplaints(format, filters);
      toast.success(`Complaints exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export complaints');
    }
  };

  const handleAssign = async (complaintId, staffId) => {
    try {
      await adminService.assignComplaint(complaintId, staffId);
      toast.success('Complaint assigned successfully');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to assign complaint');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Complaints</h1>
          <p className="text-gray-600 mt-1">
            View and manage all complaints in the system
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={() => fetchComplaints()}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <select
            onChange={(e) => handleExport(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            defaultValue=""
          >
            <option value="" disabled>Export as...</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Escalated</p>
              <p className="text-2xl font-bold text-red-600">{stats.escalated}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Department Filter */}
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Departments</option>
            <option value="it">IT</option>
            <option value="maintenance">Maintenance</option>
            <option value="library">Library</option>
            <option value="security">Security</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Categories</option>
            <option value="dormitory">Dormitory</option>
            <option value="internet">Internet</option>
            <option value="laboratory">Laboratory</option>
            <option value="classroom">Classroom</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Active Filters:</span>
            {filters.priority !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Priority: {filters.priority}
              </span>
            )}
            {filters.department !== 'all' && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                Dept: {filters.department}
              </span>
            )}
          </div>
          
          <button
            onClick={() => setFilters({
              status: [],
              priority: 'all',
              department: 'all',
              category: 'all',
              dateFrom: '',
              dateTo: '',
              search: ''
            })}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedComplaints.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-700">
                {selectedComplaints.length} complaint(s) selected
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1 text-sm border border-blue-300 rounded-lg bg-white"
              >
                <option value="assign">Assign to Staff</option>
                <option value="delete">Delete</option>
                <option value="export">Export Selected</option>
                <option value="status">Update Status</option>
              </select>
              <button
                onClick={() => setShowBulkModal(true)}
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply
              </button>
              <button
                onClick={() => setSelectedComplaints([])}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow">
        <ComplaintTable
          complaints={complaints}
          loading={loading}
          showActions={true}
          onSelect={(selected) => setSelectedComplaints(selected)}
          onAssign={handleAssign}
          onRefresh={fetchComplaints}
        />
      </div>

      {/* Bulk Action Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bulk {bulkAction.charAt(0).toUpperCase() + bulkAction.slice(1)}
            </h3>
            
            {bulkAction === 'assign' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Assign {selectedComplaints.length} complaint(s) to:
                </p>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select Staff Member</option>
                  <option value="1">John Doe (IT)</option>
                  <option value="2">Jane Smith (Maintenance)</option>
                  <option value="3">Mike Johnson (Library)</option>
                </select>
              </div>
            )}

            {bulkAction === 'status' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Update status for {selectedComplaints.length} complaint(s):
                </p>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}

            {bulkAction === 'delete' && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">
                    ⚠️ Warning: This action cannot be undone. {selectedComplaints.length} complaint(s) will be permanently deleted.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAction}
                className={`px-4 py-2 rounded-lg text-white ${
                  bulkAction === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageComplaints;