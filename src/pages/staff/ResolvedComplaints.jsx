import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import complaintService from '../../services/api/complaintService';
import { CheckCircle, Search, Calendar, Eye, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ResolvedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchResolved();
  }, []);

  const fetchResolved = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getAssignedComplaints();
      const resolved = Array.isArray(data)
        ? data.filter((c) => ['resolved', 'closed'].includes(c.status))
        : [];
      setComplaints(resolved);
    } catch (error) {
      toast.error('Failed to load resolved complaints');
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter((c) => {
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
        (c.studentName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Resolved Complaints</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Complaints you have resolved</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{complaints.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Resolved</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{complaints.filter((c) => c.status === 'resolved').length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{complaints.filter((c) => c.status === 'closed').length}</p>
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
              placeholder="Search by title, ID, or student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
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

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No resolved complaints</p>
            <p className="text-sm mt-1">Complaints you resolve will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Resolved</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">{c.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{c.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{c.studentName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        c.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        c.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        c.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                        c.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {c.status === 'resolved' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {c.status === 'resolved' ? 'Resolved' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {c.resolvedAt ? new Date(c.resolvedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/staff/complaints/${c.id}`}
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResolvedComplaints;
