import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComplaintForm from '../../components/forms/ComplaintForm';
import complaintService from '../../services/api/complaintService';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const NewComplaint = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await complaintService.createComplaint(formData);
      toast.success('Complaint submitted successfully!');
      navigate('/student/complaints');
    } catch (error) {
      toast.error(error.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/student/dashboard" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Submit New Complaint</h1>
        <p className="text-gray-600 mt-1">
          Please provide detailed information about your issue
        </p>
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Submission Guidelines</h3>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Be specific and detailed in your description</li>
              <li>• Include the exact location of the issue</li>
              <li>• Attach relevant photos if available (max 5MB each)</li>
              <li>• You will receive updates via notifications</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Complaint Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ComplaintForm 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/student/dashboard')}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default NewComplaint;