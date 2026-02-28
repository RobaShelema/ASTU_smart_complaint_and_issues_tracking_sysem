import React, { useState } from 'react';
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITY } from '../../utils/constants';

const ComplaintForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
    attachments: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="">Select Category</option>
            {COMPLAINT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            {Object.entries(COMPLAINT_PRIORITY).map(([key, value]) => (
              <option key={key} value={value}>{key}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Attachments</label>
        <input
          type="file"
          multiple
          className="mt-1 block w-full"
          onChange={(e) => setFormData({...formData, attachments: Array.from(e.target.files)})}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
};

export default ComplaintForm;