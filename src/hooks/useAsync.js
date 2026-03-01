import { useState, useCallback } from 'react';
import { handleApiError } from '../utils/apiErrorHandler';

export const useAsync = (asyncFunction, immediate = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, pending, success, error

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setStatus('pending');
      setError(null);
      
      const result = await asyncFunction(...params);
      
      setData(result);
      setStatus('success');
      return result;
    } catch (error) {
      const apiError = handleApiError(error);
      setError(apiError);
      setStatus('error');
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setStatus('idle');
  }, []);

  // Execute immediately if requested
  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    status,
    execute,
    reset,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error'
  };
};