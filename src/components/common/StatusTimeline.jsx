import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import StatusBadge from './StatusBadge';
import { CheckCircle, Clock, User, MessageCircle, Paperclip } from 'lucide-react';

const StatusTimeline = ({ events = [], complaint }) => {
  // Generate timeline events from complaint history
  const generateTimelineEvents = () => {
    const timeline = [];

    // Submission event
    if (complaint?.createdAt) {
      timeline.push({
        id: 'submission',
        type: 'submission',
        status: 'pending',
        title: 'Complaint Submitted',
        description: complaint.description,
        timestamp: complaint.createdAt,
        user: complaint.studentName,
        icon: Clock,
        color: 'blue'
      });
    }

    // Status change events
    if (complaint?.statusHistory) {
      complaint.statusHistory.forEach((history, index) => {
        timeline.push({
          id: `status-${index}`,
          type: 'status_change',
          status: history.status,
          title: `Status changed to ${history.status}`,
          description: history.remarks || 'Status updated',
          timestamp: history.changedAt,
          user: history.changedBy,
          icon: CheckCircle,
          color: 'green'
        });
      });
    }

    // Assignment events
    if (complaint?.assignmentHistory) {
      complaint.assignmentHistory.forEach((assignment, index) => {
        timeline.push({
          id: `assignment-${index}`,
          type: 'assignment',
          title: 'Assigned to staff',
          description: `Assigned to ${assignment.staffName}`,
          timestamp: assignment.assignedAt,
          user: assignment.assignedBy,
          icon: User,
          color: 'purple'
        });
      });
    }

    // Comment events
    if (complaint?.comments) {
      complaint.comments.forEach((comment, index) => {
        timeline.push({
          id: `comment-${index}`,
          type: 'comment',
          title: 'Comment added',
          description: comment.text,
          timestamp: comment.createdAt,
          user: comment.userName,
          icon: MessageCircle,
          color: 'orange'
        });
      });
    }

    // Attachment events
    if (complaint?.attachments) {
      complaint.attachments.forEach((attachment, index) => {
        timeline.push({
          id: `attachment-${index}`,
          type: 'attachment',
          title: 'File attached',
          description: attachment.name,
          timestamp: attachment.uploadedAt || complaint.createdAt,
          user: complaint.studentName,
          icon: Paperclip,
          color: 'gray'
        });
      });
    }

    // Sort by timestamp (newest first)
    return timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const events_list = generateTimelineEvents();

  if (events_list.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>No timeline events available</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events_list.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events_list.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              
              <div className="relative flex space-x-3">
                {/* Icon */}
                <div>
                  <span className={`h-8 w-8 rounded-full bg-${event.color}-100 flex items-center justify-center ring-8 ring-white`}>
                    <event.icon className={`h-4 w-4 text-${event.color}-600`} />
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">{event.title}</span>
                    {' '}
                    <span className="text-gray-500">by {event.user}</span>
                  </div>
                  
                  {/* Description */}
                  {event.description && (
                    <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                  )}
                  
                  {/* Status Badge for status changes */}
                  {event.status && (
                    <div className="mt-2">
                      <StatusBadge status={event.status} size="sm" />
                    </div>
                  )}
                  
                  {/* Timestamp */}
                  <div className="mt-1 text-xs text-gray-400">
                    <time dateTime={event.timestamp}>
                      {format(new Date(event.timestamp), 'PPP p')}
                      {' '}
                      <span className="text-gray-300">
                        ({formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })})
                      </span>
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusTimeline;