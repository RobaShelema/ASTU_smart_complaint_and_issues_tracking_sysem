import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import complaintService from '../../services/api/complaintService';
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  XCircle,
  FileText,
  User,
  Building,
  Calendar,
  MapPin,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STEPS = [
  { key: 'pending',     label: 'Submitted',   icon: FileText,    color: 'yellow' },
  { key: 'assigned',    label: 'Assigned',     icon: User,        color: 'purple' },
  { key: 'in_progress', label: 'In Progress',  icon: RefreshCw,   color: 'blue' },
  { key: 'resolved',    label: 'Resolved',     icon: CheckCircle, color: 'green' },
];

const STATUS_INDEX = { pending: 0, assigned: 1, in_progress: 2, resolved: 3, closed: 3 };

const colorClasses = {
  yellow: { active: 'bg-yellow-500 text-white ring-yellow-200', line: 'bg-yellow-500' },
  purple: { active: 'bg-purple-500 text-white ring-purple-200', line: 'bg-purple-500' },
  blue:   { active: 'bg-blue-500 text-white ring-blue-200',     line: 'bg-blue-500' },
  green:  { active: 'bg-green-500 text-white ring-green-200',   line: 'bg-green-500' },
};

const statusBadge = {
  pending:     'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  assigned:    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  resolved:    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  closed:      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  escalated:   'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const safeDate = (d) => {
  if (!d) return null;
  const date = new Date(d);
  return isNaN(date.getTime()) ? null : date;
};

const formatDate = (d) => {
  const date = safeDate(d);
  return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
};

const TrackStatus = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getStudentComplaints(user?.id);
      setComplaints(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const activeComplaints = complaints.filter(
    (c) => !['resolved', 'closed'].includes(c.status)
  );

  const filtered = complaints.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (c.id || '').toLowerCase().includes(q) ||
      (c.title || '').toLowerCase().includes(q)
    );
  });

  const currentStep = (status) => STATUS_INDEX[status] ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Track Status</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Search and track the real-time status of your complaints
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Filed', value: complaints.length, icon: FileText, cls: 'text-gray-900 dark:text-white' },
          { label: 'Active', value: activeComplaints.length, icon: RefreshCw, cls: 'text-blue-600' },
          { label: 'Pending', value: complaints.filter((c) => c.status === 'pending').length, icon: Clock, cls: 'text-yellow-600' },
          { label: 'Resolved', value: complaints.filter((c) => c.status === 'resolved').length, icon: CheckCircle, cls: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
              <s.icon className={`h-5 w-5 ${s.cls}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${s.cls}`}>{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by complaint ID or title..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Complaint list */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {filtered.length} complaint{filtered.length !== 1 ? 's' : ''} found
            </p>

            {filtered.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-10 text-center">
                <AlertCircle className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No complaints found</p>
                <Link
                  to="/student/new-complaint"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mt-3"
                >
                  Submit a new complaint <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
                    className={`w-full text-left bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all hover:shadow-md ${
                      selectedComplaint?.id === c.id
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {c.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          #{c.id} · {c.category}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 text-[11px] font-semibold rounded-full ${statusBadge[c.status] || statusBadge.pending}`}>
                        {c.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                      {STATUS_STEPS.map((step, i) => {
                        const reached = i <= currentStep(c.status);
                        const palette = colorClasses[step.color];
                        return (
                          <React.Fragment key={step.key}>
                            <div
                              className={`h-2 w-2 rounded-full ${reached ? palette.line : 'bg-gray-200 dark:bg-gray-600'}`}
                            />
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 ${i < currentStep(c.status) ? 'bg-blue-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            {selectedComplaint ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden sticky top-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-lg font-bold truncate">{selectedComplaint.title}</p>
                      <p className="text-sm text-blue-100 mt-0.5">Ticket #{selectedComplaint.id}</p>
                    </div>
                    <Link
                      to={`/student/complaints/${selectedComplaint.id}`}
                      className="shrink-0 flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Full
                    </Link>
                  </div>
                </div>

                {/* Details grid */}
                <div className="p-6 grid grid-cols-2 gap-4 border-b border-gray-100 dark:border-gray-700">
                  {[
                    { icon: Building, label: 'Department', value: selectedComplaint.department || '—' },
                    { icon: Calendar, label: 'Submitted', value: formatDate(selectedComplaint.createdAt) },
                    { icon: MapPin, label: 'Location', value: selectedComplaint.location || '—' },
                    { icon: Clock, label: 'Deadline', value: formatDate(selectedComplaint.deadline) },
                  ].map((d) => (
                    <div key={d.label} className="flex items-start gap-2.5">
                      <d.icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">{d.label}</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{d.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress timeline */}
                <div className="p-6">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-5 uppercase tracking-wider">
                    Progress Timeline
                  </h3>

                  <div className="space-y-0">
                    {STATUS_STEPS.map((step, i) => {
                      const StepIcon = step.icon;
                      const reached = i <= currentStep(selectedComplaint.status);
                      const isCurrent = i === currentStep(selectedComplaint.status);
                      const palette = colorClasses[step.color];
                      const isLast = i === STATUS_STEPS.length - 1;

                      return (
                        <div key={step.key} className="flex gap-4">
                          {/* Dot + Line */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                reached
                                  ? `${palette.active} ring-4 ${isCurrent ? 'scale-110' : ''}`
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                              }`}
                            >
                              <StepIcon className="h-4.5 w-4.5" />
                            </div>
                            {!isLast && (
                              <div className={`w-0.5 h-12 ${reached && i < currentStep(selectedComplaint.status) ? palette.line : 'bg-gray-200 dark:bg-gray-700'}`} />
                            )}
                          </div>

                          {/* Content */}
                          <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                            <p className={`text-sm font-bold ${reached ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                              {step.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {i === 0 && formatDate(selectedComplaint.createdAt)}
                              {i === 1 && (selectedComplaint.assignedAt ? `Assigned on ${formatDate(selectedComplaint.assignedAt)}` : reached ? 'Assigned' : 'Waiting for assignment')}
                              {i === 2 && (reached ? 'Staff is working on your complaint' : 'Pending staff action')}
                              {i === 3 && (reached ? `Resolved on ${formatDate(selectedComplaint.resolvedAt)}` : 'Awaiting resolution')}
                            </p>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600" />
                                </span>
                                Current Step
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center sticky top-6">
                <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Select a Complaint</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs mx-auto">
                  Choose a complaint from the list to see its detailed progress timeline and current status.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackStatus;
