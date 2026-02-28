import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 [API] ${config.method.toUpperCase()} ${config.url}`, config);
    }

    return config;
  },
  (error) => {
    console.error('❌ [API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ [API] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('❌ [API] Response Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    // Handle token expiration (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if we have a refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Attempt to refresh token
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          if (response.data.token) {
            // Store new tokens
            localStorage.setItem('token', response.data.token);
            if (response.data.refreshToken) {
              localStorage.setItem('refreshToken', response.data.refreshToken);
            }

            // Update authorization header
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            
            // Retry original request
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - redirect to login
          localStorage.clear();
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - redirect to login
        localStorage.clear();
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
    }

    // Handle forbidden (403)
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    }

    // Handle not found (404)
    if (error.response?.status === 404) {
      toast.error('Resource not found');
    }

    // Handle validation errors (422)
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      if (errors) {
        Object.values(errors).forEach((errorMessages) => {
          errorMessages.forEach((message) => {
            toast.error(message);
          });
        });
      }
    }

    // Handle server errors (500)
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// Helper methods for common request types
export const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  
  // File upload helper
  upload: (url, formData, onProgress) => {
    return axiosInstance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  },
};

export default axiosInstance;