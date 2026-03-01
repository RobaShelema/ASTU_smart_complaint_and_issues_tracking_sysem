import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

const RouteErrorHandler = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Route error:', error);

  let title = 'Oops! Something went wrong';
  let message = 'An unexpected error occurred. Please try again.';
  let status = error?.status || 500;

  // Handle specific HTTP errors
  if (error?.status === 404) {
    title = 'Page Not Found';
    message = 'The page you are looking for does not exist or has been moved.';
  } else if (error?.status === 403) {
    title = 'Access Denied';
    message = 'You do not have permission to access this page.';
  } else if (error?.status === 401) {
    title = 'Unauthorized';
    message = 'Please login to access this page.';
  } else if (error?.status === 500) {
    title = 'Server Error';
    message = 'An error occurred on the server. Please try again later.';
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-[rgb(var(--color-danger))] bg-opacity-10">
            <AlertTriangle className="h-12 w-12 text-[rgb(var(--color-danger))]" />
          </div>
        </div>

        {/* Error Code */}
        <p className="text-6xl font-bold text-[rgb(var(--color-danger))] mb-4">
          {status}
        </p>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))] mb-2">
          {title}
        </h1>

        {/* Error Message */}
        <p className="text-[rgb(var(--text-secondary))] mb-6">
          {message}
        </p>

        {/* Error Details (in development) */}
        {import.meta.env.DEV && error?.data && (
          <div className="mb-6 p-4 bg-[rgb(var(--bg-secondary))] rounded-lg text-left overflow-auto max-h-40">
            <pre className="text-xs text-[rgb(var(--text-secondary))]">
              {typeof error.data === 'string' 
                ? error.data 
                : JSON.stringify(error.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="btn-outline w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn-outline w-full sm:w-auto"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorHandler;