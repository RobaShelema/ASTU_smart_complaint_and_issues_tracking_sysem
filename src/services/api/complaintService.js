import axiosInstance from './axiosConfig';

export const complaintService = {
  getAll: async (params) => {
    const response = await axiosInstance.get('/complaints', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/complaints/${id}`);
    return response.data;
  },

  create: async (complaintData) => {
    const formData = new FormData();
    Object.keys(complaintData).forEach(key => {
      if (key === 'attachments') {
        complaintData.attachments.forEach(file => {
          formData.append('attachments[]', file);
        });
      } else {
        formData.append(key, complaintData[key]);
      }
    });
    
    const response = await axiosInstance.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateStatus: async (id, status, remarks) => {
    const response = await axiosInstance.patch(`/complaints/${id}/status`, {
      status,
      remarks
    });
    return response.data;
  },

  getStudentComplaints: async (studentId) => {
    const response = await axiosInstance.get(`/students/${studentId}/complaints`);
    return response.data;
  },

  getStaffAssigned: async (staffId) => {
    const response = await axiosInstance.get(`/staff/${staffId}/assigned`);
    return response.data;
  }
};