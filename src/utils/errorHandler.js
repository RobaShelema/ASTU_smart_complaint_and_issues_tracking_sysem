import toast from 'react-hot-toast';

export const handleApiError = (error, customMessage = null) => {
  // Log error in development
  if (import.meta.env.DEV) {
    console.error('API Error:', error);
  }

  // Extract error message
  let message = customMessage || 'An error occurred';

  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 400:
        message = error.response.data.message || 'Bad request';
        break;
      case 401:
        message = 'Session expired. Please login again.';
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        break;
      case 403:
        message = 'You do not have permission to perform this action';
        break;
      case 404:
        message = 'Resource not found';
        break;
      case 422:
        // Validation errors
        const errors = error.response.data.errors;
        if (errors) {
          Object.values(errors).flat().forEach(err => toast.error(err));
        }
        return;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        message = error.response.data.message || 'An error occurred';
    }
  } else if (error.request) {
    // Request made but no response
    message = 'Unable to connect to server. Please check your connection.';
  } else {
    // Something else happened
    message = error.message || 'An unexpected error occurred';
  }

  // Show toast notification
  toast.error(message);

  return { message, status: error.response?.status };
};