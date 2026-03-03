import React, { useState, useEffect } from 'react';
import adminService from '../../services/api/adminService';
import ComplaintTable from '../../components/tables/ComplaintTable';
import {
  Filter,
  Download,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManageComplaints = () => {
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    department: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllComplaints();
      setAllComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = allComplaints.filter(c => {
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const matchesSearch =
        (c.title || '').toLowerCase().includes(term) ||
        (c.id || '').toLowerCase().includes(term) ||
        (c.studentName || '').toLowerCase().includes(term) ||
        (c.description || '').toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }
    if (filters.status !== 'all' && c.status !== filters.status) return false;
    if (filters.priority !== 'all' && c.priority !== filters.priority) return false;
    if (filters.department !== 'all' && c.department !== filters.department) return false;
    if (filters.category !== 'all' && c.category !== filters.category) return false;
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      if (new Date(c.createdAt) < from) return false;
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      if (new Date(c.createdAt) > to) return false;
    }
    return true;
  });

  const stats = {
    total: allComplaints.length,
    pending: allComplaints.filter(c => c.status === 'pending').length,
    inProgress: allComplaints.filter(c => c.status === 'in_progress').length,
    resolved: allComplaints.filter(c => c.status === 'resolved').length,
    closed: allComplaints.filter(c => c.status === 'closed').length
  };

  const departments = [...new Set(allComplaints.map(c => c.department).filter(Boolean))];
  const categories = [...new Set(allComplaints.map(c => c.category).filter(Boolean))];

  const isFiltered = filters.search || filters.status !== 'all' || filters.priority !== 'all' ||
    filters.department !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo;

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      department: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
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
            onClick={fetchComplaints}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button onClick={() => setFilters({ ...filters, status: 'all' })} className="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-400" />
          </div>
        </button>

        <button onClick={() => setFilters({ ...filters, status: 'pending' })} className="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </button>

        <button onClick={() => setFilters({ ...filters, status: 'in_progress' })} className="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-blue-400" />
          </div>
        </button>

        <button onClick={() => setFilters({ ...filters, status: 'resolved' })} className="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </button>

        <button onClick={() => setFilters({ ...filters, status: 'closed' })} className="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-gray-400" />
          </div>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

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

          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="From date"
            />
          </div>
          <div>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="To date"
            />
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {isFiltered ? `Showing ${filteredComplaints.length} of ${allComplaints.length}` : 'No filters active'}
            </span>
          </div>
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow">
        <ComplaintTable
          complaints={filteredComplaints}
          loading={loading}
          showActions={true}
          linkPrefix="/admin/complaints"
        />
      </div>
    </div>
  );
};

export default ManageComplaints;
