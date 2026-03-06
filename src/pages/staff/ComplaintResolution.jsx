import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import complaintService from '../../services/api/complaintService';
import ResolutionModal from '../../components/modals/ResolutionModal';
import StatusBadge from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  Tag,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  RefreshCw,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const safeFormat = (dateStr, pattern) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return format(d, pattern);
};

const ComplaintResolution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  // Status update state
  const [showStatusPanel, setShowStatusPanel] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Remarks state
  const [remarkText, setRemarkText] = useState('');
  const [remarks, setRemarks] = useState([]);
  const [addingRemark, setAddingRemark] = useState(false);

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getComplaintById(id);
      setComplaint(data);
      setRemarks(data?.remarks || data?.comments || []);
    } catch {
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
    } catch {
      toast.error('Failed to resolve complaint');
    }
  };

  const handleStatusUpdate = useCallback(async () => {
    if (!newStatus) return;
    setUpdatingStatus(true);
    try {
      await complaintService.updateStatus(id, newStatus, statusRemarks || `Status changed to ${newStatus}`);
      setComplaint((prev) => prev ? { ...prev, status: newStatus } : prev);
      const now = new Date().toISOString();
      if (statusRemarks.trim()) {
        setRemarks((prev) => [
          ...prev,
          {
            id: `r-${Date.now()}`,
            text: `[Status → ${newStatus.replace('_', ' ')}] ${statusRemarks}`,
            userName: user?.name || 'Staff',
            createdAt: now,
            type: 'status_update',
          },
        ]);
      }
      toast.success('Status updated successfully');
      setShowStatusPanel(false);
      setNewStatus('');
      setStatusRemarks('');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  }, [id, newStatus, statusRemarks, user?.name]);

  const handleAddRemark = useCallback(async () => {
    if (!remarkText.trim()) return;
    setAddingRemark(true);
    try {
      await complaintService.addComment(id, remarkText);
      const now = new Date().toISOString();
      setRemarks((prev) => [
        ...prev,
        {
          id: `r-${Date.now()}`,
          text: remarkText,
          userName: user?.name || 'Staff',
          createdAt: now,
          type: 'remark',
        },
      ]);
      setRemarkText('');
      toast.success('Remark added');
    } catch {
      toast.error('Failed to add remark');
    } finally {
      setAddingRemark(false);
    }
  }, [id, remarkText, user?.name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Complaint not found</h3>
        <Link to="/staff/assigned" className="mt-4 text-blue-600 hover:text-blue-800 text-sm">
          Back to Assigned Complaints
        </Link>
      </div>
    );
  }

  const deadlineDate = complaint.deadline ? new Date(complaint.deadline) : null;
  const isOverdue = deadlineDate && !isNaN(deadlineDate.getTime()) && deadlineDate < new Date() && complaint.status !== 'resolved' && complaint.status !== 'closed';
  const isResolved = complaint.status === 'resolved' || complaint.status === 'closed';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          to="/staff/assigned"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Assigned
        </Link>
        <StatusBadge status={complaint.status} size="lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Complaint Details ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{complaint.title}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ticket #{complaint.id}</p>
                </div>
                {isOverdue && (
                  <span className="shrink-0 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Overdue
                  </span>
                )}
              </div>
            </div>

            {/* Details grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: User, label: 'Student', value: complaint.studentName || '—', sub: complaint.studentId },
                { icon: Calendar, label: 'Submitted', value: safeFormat(complaint.createdAt, 'PPP'), sub: safeFormat(complaint.createdAt, 'p') },
                { icon: Tag, label: 'Category', value: complaint.category || '—' },
                { icon: MapPin, label: 'Location', value: complaint.location || '—' },
                { icon: Clock, label: 'Deadline', value: complaint.deadline ? safeFormat(complaint.deadline, 'PPP') : 'No deadline', cls: isOverdue ? 'text-red-600 font-semibold' : '' },
                { icon: AlertCircle, label: 'Priority', badge: true, value: complaint.priority },
              ].map((d) => (
                <div key={d.label} className="flex items-start gap-3">
                  <d.icon className="h-4.5 w-4.5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{d.label}</p>
                    {d.badge ? (
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                        d.value === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        d.value === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                        d.value === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {d.value?.charAt(0).toUpperCase() + d.value?.slice(1)}
                      </span>
                    ) : (
                      <>
                        <p className={`text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5 ${d.cls || ''}`}>{d.value}</p>
                        {d.sub && <p className="text-xs text-gray-500 dark:text-gray-400">{d.sub}</p>}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="px-6 pb-6 pt-2">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2 uppercase tracking-wider">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                {complaint.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* ── Remarks / Comments Section ── */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-gray-400" />
                Remarks &amp; Notes
              </h2>
              <span className="text-xs text-gray-400">{remarks.length} {remarks.length === 1 ? 'entry' : 'entries'}</span>
            </div>

            {/* Remarks list */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-80 overflow-y-auto">
              {remarks.length === 0 ? (
                <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm font-medium">No remarks yet</p>
                  <p className="text-xs mt-0.5">Add a remark below to document your progress.</p>
                </div>
              ) : (
                remarks.map((r) => (
                  <div key={r.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        {(r.userName || 'S').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{r.userName || 'Staff'}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">{safeFormat(r.createdAt, 'MMM d, yyyy h:mm a')}</span>
                      {r.type === 'status_update' && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded">
                          Status Update
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 ml-8">{r.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add remark input */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
              <div className="flex gap-3">
                <textarea
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Add a remark, note, or update..."
                  rows="2"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddRemark();
                    }
                  }}
                />
                <button
                  onClick={handleAddRemark}
                  disabled={addingRemark || !remarkText.trim()}
                  className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 text-sm font-medium shrink-0"
                >
                  {addingRemark ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        </div>

        {/* ── Right: Actions Panel ── */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Actions</h2>
            </div>
            <div className="p-5 space-y-3">
              {/* Update Status */}
              <button
                onClick={() => setShowStatusPanel(!showStatusPanel)}
                disabled={isResolved}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-left"
              >
                <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Update Status</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Change ticket status with remarks</p>
                </div>
              </button>

              {/* Status update panel */}
              {showStatusPanel && !isResolved && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-gray-600">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select new status</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Revert to Pending</option>
                    <option value="escalated">Escalate</option>
                  </select>
                  <textarea
                    value={statusRemarks}
                    onChange={(e) => setStatusRemarks(e.target.value)}
                    placeholder="Add remarks for this status change..."
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowStatusPanel(false); setNewStatus(''); setStatusRemarks(''); }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={!newStatus || updatingStatus}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {updatingStatus ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      Update
                    </button>
                  </div>
                </div>
              )}

              {/* Resolve */}
              <button
                onClick={() => setShowResolutionModal(true)}
                disabled={isResolved}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-left"
              >
                <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">Resolve Complaint</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Mark as resolved with details</p>
                </div>
              </button>

              {isResolved && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">This complaint has been resolved.</p>
                </div>
              )}
            </div>
          </div>

          {/* Complaint Info Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Summary</h2>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <StatusBadge status={complaint.status} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Priority</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{complaint.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Department</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{complaint.department || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Submitted</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{safeFormat(complaint.createdAt, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Remarks</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{remarks.length}</span>
              </div>
            </div>
          </div>
        </div>
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
