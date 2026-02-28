import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageCircle,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDistanceToNow } from 'date-fns';

const AssignedComplaintsTable = ({ 
  complaints, 
  loading, 
  onStatusUpdate,
  onResolve,
  showActions = true 
}) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRows, setExpandedRows] = useState([]);
  const [statusUpdateModal, setStatusUpdateModal] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleRowExpand = (complaintId) => {
    setExpandedRows(prev =>
      prev.includes(complaintId)
        ? prev.filter(id => id !== complaintId)
        : [...prev, complaintId]
    );
  };

  const sortedComplaints = [...complaints].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'createdAt' || sortField === 'deadline') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredComplaints = sortedComplaints.filter(complaint => {
    const matchesSearch = complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-600' };
    if (diffDays <= 2) return { text: `${diffDays} days left`, color: 'text-yellow-600' };
    return { text: `${diffDays} days left`, color: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints by ID, title, or student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Complaint
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-8 w-8 text-gray-300 mb-2" />
                    <p>No assigned complaints found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint) => {
                const deadlineStatus = getDeadlineStatus(complaint.deadline);
                const isExpanded = expandedRows.includes(complaint.id);
                
                return (
                  <React.Fragment key={complaint.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleRowExpand(complaint.id)}
                            className="mr-2 text-gray-400 hover:text-gray-600"
                          >
                            {isExpanded ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                            }
                          </button>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{complaint.id}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {complaint.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{complaint.studentName}</div>
                        <div className="text-xs text-gray-500">{complaint.studentId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority?.charAt(0).toUpperCase() + complaint.priority?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={complaint.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className={deadlineStatus.color}>
                            {deadlineStatus.text}
                          </span>
                          <div className="text-xs text-gray-500">
                            {new Date(complaint.deadline).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDistanceToNow(new Date(complaint.assignedAt), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <Link
                          to={`/staff/complaints/${complaint.id}`}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setStatusUpdateModal(complaint)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Update Status"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                        {complaint.status !== 'resolved' && (
                          <button
                            onClick={() => onResolve(complaint)}
                            className="text-green-600 hover:text-green-900"
                            title="Resolve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            <p className="font-medium mb-2">Description:</p>
                            <p className="mb-4">{complaint.description}</p>
                            
                            {complaint.lastNote && (
                              <>
                                <p className="font-medium mb-2">Last Note:</p>
                                <p className="text-gray-600">{complaint.lastNote}</p>
                              </>
                            )}
                            
                            {complaint.attachments?.length > 0 && (
                              <div className="mt-4">
                                <p className="font-medium mb-2">Attachments:</p>
                                <div className="flex space-x-2">
                                  {complaint.attachments.map((file, idx) => (
                                    <a
                                      key={idx}
                                      href={file.url}
                                      className="text-xs text-blue-600 hover:underline"
                                      target="_blank"
                                      rel="noopener"
                                    >
                                      {file.name}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      {statusUpdateModal && (
        <StatusUpdateModal
          complaint={statusUpdateModal}
          onClose={() => setStatusUpdateModal(null)}
          onUpdate={(status, remarks) => {
            onStatusUpdate(statusUpdateModal.id, status, remarks);
            setStatusUpdateModal(null);
          }}
        />
      )}
    </div>
  );
};

// Status Update Modal Component
const StatusUpdateModal = ({ complaint, onClose, onUpdate }) => {
  const [status, setStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onUpdate(status, remarks);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Update Status - #{complaint.id}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks / Update Notes
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any notes about the status update..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignedComplaintsTable;