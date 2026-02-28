import React, { useState } from 'react';
import { X, CheckCircle, Paperclip, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const ResolutionModal = ({ complaint, onClose, onSubmit }) => {
  const [resolution, setResolution] = useState({
    action: '',
    notes: '',
    attachments: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setResolution(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...acceptedFiles]
      }));
    },
    maxSize: 5242880, // 5MB
    maxFiles: 3,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    }
  });

  const validateForm = () => {
    const newErrors = {};
    if (!resolution.action) {
      newErrors.action = 'Please select an action taken';
    }
    if (!resolution.notes.trim()) {
      newErrors.notes = 'Please provide resolution notes';
    } else if (resolution.notes.length < 20) {
      newErrors.notes = 'Please provide more detailed notes (min 20 characters)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await onSubmit(resolution);
    setIsSubmitting(false);
  };

  const removeAttachment = (index) => {
    setResolution(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Resolve Complaint</h2>
              <p className="text-sm text-gray-600 mt-1">
                Complaint #{complaint.id}: {complaint.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Complaint Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Student</p>
                <p className="text-sm font-medium">{complaint.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium">{complaint.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  complaint.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {complaint.priority}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium">{complaint.location}</p>
              </div>
            </div>
          </div>

          {/* Resolution Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Action Taken */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Taken <span className="text-red-500">*</span>
              </label>
              <select
                value={resolution.action}
                onChange={(e) => setResolution(prev => ({ ...prev, action: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.action ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select action</option>
                <option value="repaired">Repaired/Fixed</option>
                <option value="replaced">Replaced</option>
                <option value="escalated">Escalated to higher authority</option>
                <option value="referred">Referred to another department</option>
                <option value="informed">User informed</option>
                <option value="other">Other</option>
              </select>
              {errors.action && (
                <p className="mt-1 text-sm text-red-600">{errors.action}</p>
              )}
            </div>

            {/* Resolution Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                value={resolution.notes}
                onChange={(e) => setResolution(prev => ({ ...prev, notes: e.target.value }))}
                rows="5"
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.notes ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the resolution in detail..."
              />
              <div className="flex justify-between mt-1">
                {errors.notes ? (
                  <p className="text-sm text-red-600">{errors.notes}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {resolution.notes.length}/20 characters minimum
                  </p>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence/Attachments (Optional)
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input {...getInputProps()} />
                <Paperclip className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                {isDragActive ? (
                  <p className="text-sm text-blue-600">Drop files here...</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Drag & drop files, or click to select</p>
                    <p className="text-xs text-gray-400 mt-1">Images or PDF (Max 5MB each)</p>
                  </>
                )}
              </div>

              {/* Attachment List */}
              {resolution.attachments.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {resolution.attachments.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Notification Options */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                />
                <div>
                  <span className="text-sm font-medium text-blue-800">
                    Notify student about resolution
                  </span>
                  <p className="text-xs text-blue-600 mt-1">
                    Student will receive an email and notification about this resolution
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Buttons */}
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
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Mark as Resolved</span>
                  </>
                )}
              </button>
            </div>

            {/* Warning for urgent */}
            {complaint.priority === 'urgent' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700">
                  This is an URGENT complaint. Please ensure all necessary actions are taken 
                  and document the resolution thoroughly.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResolutionModal;