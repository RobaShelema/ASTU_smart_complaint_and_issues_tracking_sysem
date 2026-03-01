import { api } from './axiosConfig';

class AdminService {
  // ==================== COMPLAINT MANAGEMENT ====================

  // Get all complaints (with filters)
  async getAllComplaints(filters = {}) {
    try {
      const queryParams = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v && v !== 'all' && (!Array.isArray(v) || v.length > 0)))
      ).toString();
      const response = await api.get(`/admin/complaints?${queryParams}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== USER MANAGEMENT ====================
  
  // Get all users
  async getUsers(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/users?${queryParams}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single user
  async getUserById(id) {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new user
  async createUser(userData) {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete user
  async deleteUser(id) {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Bulk user operations
  async bulkUserAction(userIds, action) {
    try {
      const response = await api.post('/admin/users/bulk', {
        user_ids: userIds,
        action
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== DEPARTMENT MANAGEMENT ====================

  // Get all departments
  async getDepartments() {
    try {
      const response = await api.get('/admin/departments');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create department
  async createDepartment(deptData) {
    try {
      const response = await api.post('/admin/departments', deptData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update department
  async updateDepartment(id, deptData) {
    try {
      const response = await api.put(`/admin/departments/${id}`, deptData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete department
  async deleteDepartment(id) {
    try {
      const response = await api.delete(`/admin/departments/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== CATEGORY MANAGEMENT ====================

  // Get all categories
  async getCategories() {
    try {
      const response = await api.get('/admin/categories');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create category
  async createCategory(categoryData) {
    try {
      const response = await api.post('/admin/categories', categoryData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update category
  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/admin/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete category
  async deleteCategory(id) {
    try {
      const response = await api.delete(`/admin/categories/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== DASHBOARD STATISTICS ====================

  // Get dashboard statistics
  async getDashboardStats(dateRange = 'week') {
    try {
      const response = await api.get(`/admin/stats/dashboard?range=${dateRange}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get complaint trends
  async getComplaintTrends(dateRange = 'week') {
    try {
      const response = await api.get(`/admin/stats/trends?range=${dateRange}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get department statistics
  async getDepartmentStats() {
    try {
      const response = await api.get('/admin/stats/departments');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get category statistics
  async getCategoryStats() {
    try {
      const response = await api.get('/admin/stats/categories');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const response = await api.get('/admin/stats/users');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== REPORTS ====================

  // Generate report
  async generateReport(reportConfig) {
    try {
      const response = await api.post('/admin/reports/generate', reportConfig);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Export report
  async exportReport(format, filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/reports/export/${format}?${queryParams}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get saved reports
  async getSavedReports() {
    try {
      const response = await api.get('/admin/reports/saved');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== SYSTEM ====================

  // Get system logs
  async getSystemLogs(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/system/logs?${queryParams}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get system health
  async getSystemHealth() {
    try {
      const response = await api.get('/admin/system/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSettings(settingsData) {
    try {
      const response = await api.put('/admin/settings', settingsData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Clear cache
  async clearCache() {
    try {
      const response = await api.post('/admin/system/clear-cache');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create backup
  async createBackup() {
    try {
      const response = await api.post('/admin/system/backup');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get recent complaints (for dashboard)
  async getRecentComplaints(limit = 10) {
    try {
      const response = await api.get(`/admin/complaints/recent?limit=${limit}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get recent users (for dashboard)
  async getRecentUsers(limit = 5) {
    try {
      const response = await api.get(`/admin/users/recent?limit=${limit}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Export users
  async exportUsers(format, userIds = []) {
    try {
      const response = await api.post(`/admin/users/export/${format}`, {
        user_ids: userIds
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Bulk complaint action
  async bulkComplaintAction(complaintIds, action) {
    try {
      const response = await api.post('/admin/complaints/bulk', {
        complaint_ids: complaintIds,
        action
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || 'Admin operation failed',
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

const adminService = new AdminService();
export default adminService;