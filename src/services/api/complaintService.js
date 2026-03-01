import { api } from './axiosConfig';

class ComplaintService {
  // Get all complaints (with filters)
  async getAllComplaints(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/complaints?${queryParams}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single complaint by ID
  async getComplaintById(id) {
    try {
      const response = await api.get(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new complaint
  async createComplaint(complaintData) {
    try {
      // Handle file uploads
      if (complaintData.attachments?.length > 0) {
        const formData = new FormData();
        
        // Append all form fields
        Object.keys(complaintData).forEach(key => {
          if (key === 'attachments') {
            complaintData.attachments.forEach((file, index) => {
              formData.append(`attachments[${index}]`, file);
            });
          } else {
            formData.append(key, complaintData[key]);
          }
        });

        const response = await api.upload('/complaints', formData);
        return response.data;
      } else {
        // No files - regular JSON post
        const response = await api.post('/complaints', complaintData);
        return response.data;
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update complaint
  async updateComplaint(id, complaintData) {
    try {
      const response = await api.put(`/complaints/${id}`, complaintData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update complaint status
  async updateStatus(id, status, remarks = '') {
    try {
      const response = await api.patch(`/complaints/${id}/status`, {
        status,
        remarks
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Assign complaint to staff
  async assignComplaint(id, staffId) {
    try {
      const response = await api.post(`/complaints/${id}/assign`, {
        staff_id: staffId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Resolve complaint
  async resolveComplaint(id, resolutionData) {
    try {
      const response = await api.post(`/complaints/${id}/resolve`, resolutionData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add comment to complaint
  async addComment(id, comment) {
    try {
      const response = await api.post(`/complaints/${id}/comments`, { comment });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get comments for complaint
  async getComments(id) {
    try {
      const response = await api.get(`/complaints/${id}/comments`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get complaints for current student
  async getMyComplaints() {
    try {
      const response = await api.get('/complaints/my');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get student complaints by student ID
  async getStudentComplaints(studentId) {
    try {
      const response = await api.get(`/complaints/student/${studentId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get complaints assigned to current staff
  async getAssignedComplaints() {
    try {
      const response = await api.get('/complaints/assigned');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get complaints assigned to a specific staff member
  async getStaffAssigned(staffId) {
    try {
      const response = await api.get(`/complaints/staff/${staffId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create complaint (alias)
  async create(complaintData) {
    return this.createComplaint(complaintData);
  }

  // Get complaint statistics
  async getStats(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/complaints/stats?${queryParams}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete complaint
  async deleteComplaint(id) {
    try {
      const response = await api.delete(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Export complaints
  async exportComplaints(format = 'csv', filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/complaints/export/${format}?${queryParams}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `complaints.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || 'Failed to process complaint',
        errors: error.response.data.errors || {}
      };
    }
    return {
      status: 500,
      message: 'Network error. Please try again.',
      errors: {}
    };
  }
}

const complaintService = new ComplaintService();
export default complaintService;