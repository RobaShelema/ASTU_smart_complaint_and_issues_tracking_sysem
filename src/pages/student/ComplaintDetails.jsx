import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import complaintService from '../../services/api/complaintService';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  MapPin,
  MessageCircle,
  Paperclip,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getById(id);
      setComplaint(data);
    } catch (error) {
      toast.error('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      await complaintService.addComment(id, comment);
      setComment('');
      fetchComplaintDetails();
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
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
        <Link to="/student/complaints" className="mt-4 text-blue-600 hover:text-blue-800">
          Back to Complaints
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/complaints"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Complaints
        </Link>
        <StatusBadge status={complaint.status} size="lg" />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Title Section */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Ticket ID: #{complaint.id}</p>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Submitted By</p>
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

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-600">{complaint.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(complaint.updatedAt), 'PPP')}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(complaint.updatedAt), 'p')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Assigned To</p>
                <p className="text-sm text-gray-600">
                  {complaint.assignedTo || 'Not assigned yet'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
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

        {/* Attachments */}
        {complaint.attachments?.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Attachments</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {complaint.attachments.map((file, index) => (
                <a
                  key={index}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 truncate">{file.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Comments & Updates</h3>
          
          {/* Comment List */}
          <div className="space-y-4 mb-6">
            {complaint.comments?.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.createdAt), 'PPp')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleAddComment}
              disabled={!comment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 self-end"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;