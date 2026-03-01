import toast from 'react-hot-toast';

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error, customMessage = null) => {
  // Log error in development
  if (import.meta.env.DEV) {
    console.error('API Error:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });
  }

  // Network error
  if (error.message === 'Network Error') {
    toast.error('Network error. Please check your internet connection.');
    return new APIError('Network error', 0, null);
  }

  // Timeout error
  if (error.code === 'ECONNABORTED') {
    toast.error('Request timeout. Please try again.');
    return new APIError('Timeout', 408, null);
  }

  // No response from server
  if (!error.response) {
    toast.error('Server is not responding. Please try again later.');
    return new APIError('Server unavailable', 503, null);
  }

  const { status, data } = error.response;

  // Handle specific status codes
  switch (status) {
    case 400: // Bad Request
      if (data.errors) {
        // Validation errors
        Object.keys(data.errors).forEach(field => {
          data.errors[field].forEach(message => {
            toast.error(message);
          });
        });
      } else {
        toast.error(data.message || 'Bad request');
      }
      break;

    case 401: // Unauthorized
      toast.error('Session expired. Please login again.');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/login';
      }, 2000);
      break;

    case 403: // Forbidden
      toast.error('You do not have permission to perform this action');
      break;

    case 404: // Not Found
      toast.error('Resource not found');
      break;

    case 422: // Unprocessable Entity
      if (data.errors) {
        Object.keys(data.errors).forEach(field => {
          data.errors[field].forEach(message => {
            toast.error(message);
          });
        });
      } else {
        toast.error(data.message || 'Validation failed');
      }
      break;

    case 429: // Too Many Requests
      toast.error('Too many requests. Please try again later.');
      break;

    case 500: // Internal Server Error
      toast.error('Server error. Please try again later.');
      break;

    case 503: // Service Unavailable
      toast.error('Service temporarily unavailable. Please try again later.');
      break;

    default:
      toast.error(customMessage || data.message || 'An unexpected error occurred');
  }

  return new APIError(
    data.message || 'API Error',
    status,
    data
  );
};

export const isAPIError = (error) => {
  return error instanceof APIError;
};