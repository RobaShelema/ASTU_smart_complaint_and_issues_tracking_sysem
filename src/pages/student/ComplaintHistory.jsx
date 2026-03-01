import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import complaintService from '../../services/api/complaintService';
import { Clock, CheckCircle, XCircle, Search, Calendar, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig = {
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Clock },
  escalated: { label: 'Escalated', color: 'bg-red-100 text-red-800', icon: Clock },
};

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getMyComplaints();
      const history = Array.isArray(data)
        ? data.filter((c) => ['resolved', 'closed'].includes(c.status))
        : [];
      setComplaints(history);
    } catch (error) {
      toast.error('Failed to load complaint history');
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;

    if (dateRange !== 'all') {
      const days = (Date.now() - new Date(c.resolvedAt || c.createdAt).getTime()) / 86400000;
      if (dateRange === 'week' && days > 7) return false;
      if (dateRange === 'month' && days > 30) return false;
      if (dateRange === 'quarter' && days > 90) return false;
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        (c.title || '').toLowerCase().includes(q) ||
        (c.id || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
  const closedCount = complaints.filter((c) => c.status === 'closed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Complaint History</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View your resolved and closed complaints
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{complaints.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total History</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{closedCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Closed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, ID, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No history found</p>
            <p className="text-sm mt-1">Resolved and closed complaints will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Submitted</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Resolved</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map((c) => {
                  const cfg = statusConfig[c.status] || statusConfig.closed;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{c.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{c.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{c.category}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${cfg.color}`}>
                          <cfg.icon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/student/complaints/${c.id}`}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintHistory;
