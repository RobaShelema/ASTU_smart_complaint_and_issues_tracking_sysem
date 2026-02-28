import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import complaintService from '../../services/api/complaintService';
import ResolutionModal from '../../components/modals/ResolutionModal';
import StatusBadge from '../../components/common/StatusBadge';
import StatusTimeline from '../../components/common/StatusTimeline';
import { ArrowLeft, User, Calendar, MapPin, Tag, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ComplaintResolution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getComplaintById(id);
      setComplaint(data);
    } catch (error) {
      toast.error('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (resolutionData) => {
    try {
      await complaintService.resolveComplaint(id, resolutionData);
      toast.success('Complaint resolved successfully');
      navigate('/staff/assigned');
    } catch (error) {
      toast.error('Failed to resolve complaint');
    }
  };

  const handleStatusUpdate = async (status, remarks) => {
    try {
      await complaintService.updateStatus(id, status, remarks);
      toast.success('Status updated successfully');
      fetchComplaintDetails();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Complaint not found</h3>
        <Link to="/staff/assigned" className="mt-4 text-blue-600 hover:text-blue-800">
          Back to Assigned Complaints
        </Link>
      </div>
    );
  }

  const isOverdue = complaint.deadline && new Date(complaint.deadline) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/staff/assigned"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Assigned Complaints
        </Link>
        <StatusBadge status={complaint.status} size="lg" />
      </div>

      {/* Title Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Ticket ID: #{complaint.id}</p>
            </div>
            {isOverdue && complaint.status !== 'resolved' && (
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Overdue
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Student</p>
                <p className="text-sm text-gray-600">{complaint.studentName}</p>
                <p className="text-xs text-gray-500">{complaint.studentId}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Submitted On</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(complaint.createdAt), 'PPP')}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(complaint.createdAt), 'p')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Category</p>
                <p className="text-sm text-gray-600">{complaint.category}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">{complaint.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Deadline</p>
                <p className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                  {complaint.deadline ? format(new Date(complaint.deadline), 'PPP') : 'No deadline set'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Priority</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  complaint.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {complaint.priority?.charAt(0).toUpperCase() + complaint.priority?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">{complaint.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <select
              onChange={(e) => handleStatusUpdate(e.target.value, 'Status updated by staff')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              defaultValue=""
            >
              <option value="" disabled>Update Status</option>
              <option value="in_progress">Mark In Progress</option>
              <option value="pending">Revert to Pending</option>
            </select>
            
            <button
              onClick={() => setShowResolutionModal(true)}
              disabled={complaint.status === 'resolved'}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Resolve Complaint
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Timeline</h2>
        <StatusTimeline complaint={complaint} />
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <ResolutionModal
          complaint={complaint}
          onClose={() => setShowResolutionModal(false)}
          onSubmit={handleResolve}
        />
      )}
    </div>
  );
};

export default ComplaintResolution;