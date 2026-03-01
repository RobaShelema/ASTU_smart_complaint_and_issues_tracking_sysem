import React, { useState, useEffect } from 'react';
import complaintService from '../../services/api/complaintService';
import AssignedComplaintsTable from '../../components/tables/AssignedComplaintsTable';
import StatusFilter from '../../components/common/StatusFilter';
import { Filter, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0
  });

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getAssignedComplaints();
      setComplaints(data);
      
      const now = new Date();
      setStats({
        total: data.length,
        pending: data.filter(c => c.status === 'pending').length,
        inProgress: data.filter(c => c.status === 'in_progress').length,
        overdue: data.filter(c => {
          if (!c.deadline || c.status === 'resolved' || c.status === 'closed') return false;
          const deadline = new Date(c.deadline);
          return !isNaN(deadline.getTime()) && deadline < now;
        }).length
      });
    } catch (error) {
      toast.error('Failed to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, status, remarks) => {
    try {
      await complaintService.updateStatus(complaintId, status, remarks);
      toast.success('Status updated successfully');
      fetchAssignedComplaints();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleResolve = async (complaint) => {
    // Navigate to resolution page or open modal
  };

  const handleExport = () => {
    if (filteredComplaints.length === 0) {
      toast.error('No complaints to export');
      return;
    }
    const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Created At', 'Deadline'];
    const rows = filteredComplaints.map(c => [
      c.id,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      c.category || '',
      c.priority || '',
      c.status || '',
      c.createdAt || '',
      c.deadline || '',
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assigned-complaints-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(complaint.status)) {
      return false;
    }
    if (priorityFilter !== 'all' && complaint.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Assigned Complaints</h1>
        <p className="text-gray-600 mt-1">
          Manage and resolve complaints assigned to you
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
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
            <StatusFilter
              selectedStatuses={selectedStatuses}
              onStatusChange={setSelectedStatuses}
              onClear={() => setSelectedStatuses([])}
            />

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

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
        <AssignedComplaintsTable
          complaints={filteredComplaints}
          loading={loading}
          onStatusUpdate={handleStatusUpdate}
          onResolve={handleResolve}
        />
      </div>
    </div>
  );
};

export default AssignedComplaints;