import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, AlertCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDistanceToNow } from 'date-fns';

const RecentComplaintsTable = ({ complaints }) => {
  if (complaints.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p>No complaints found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {complaints.map((complaint) => (
            <tr key={complaint.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                #{complaint.id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {complaint.title}
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm text-gray-900">{complaint.studentName}</p>
                  <p className="text-xs text-gray-500">{complaint.studentId}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {complaint.category}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={complaint.status} />
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  complaint.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {complaint.priority}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  to={`/admin/complaints/${complaint.id}`}
                  className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentComplaintsTable;