import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ComplaintTable from '../../components/tables/ComplaintTable';
import StatusFilter from '../../components/common/StatusFilter';
import { complaintService } from '../../services/api/complaintService';
import { FileText, Filter, Download, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [dateRange, setDateRange] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getMyComplaints();
      setComplaints(data);
      
      // Calculate stats
      setStats({
        total: data.length,
        pending: data.filter(c => c.status === 'pending').length,
        inProgress: data.filter(c => c.status === 'in_progress').length,
        resolved: data.filter(c => c.status === 'resolved').length
      });
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(complaint.status)) {
      return false;
    }
    
    if (dateRange !== 'all') {
      const complaintDate = new Date(complaint.createdAt);
      const now = new Date();
      const days = (now - complaintDate) / (1000 * 60 * 60 * 24);
      
      if (dateRange === 'week' && days > 7) return false;
      if (dateRange === 'month' && days > 30) return false;
      if (dateRange === 'quarter' && days > 90) return false;
    }
    
    return true;
  });

  const handleExport = async () => {
    try {
      await complaintService.exportComplaints('csv', {
        statuses: selectedStatuses,
        dateRange
      });
      toast.success('Complaints exported successfully');
    } catch (error) {
      toast.error('Failed to export complaints');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Complaints</h1>
          <p className="text-gray-600 mt-1">
            Track and manage all your submitted complaints
          </p>
        </div>
        <Link
          to="/student/new-complaint"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FileText className="h-4 w-4" />
          <span>New Complaint</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <StatusFilter
              selectedStatuses={selectedStatuses}
              onStatusChange={setSelectedStatuses}
              onClear={() => setSelectedStatuses([])}
            />

            {/* Date Range Filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow">
        <ComplaintTable 
          complaints={filteredComplaints}
          loading={loading}
          showActions={true}
        />
      </div>
    </div>
  );
};

export default MyComplaints;