import { useState, useEffect, useCallback } from 'react';
import complaintService from '../services/api/complaintService';
import toast from 'react-hot-toast';

export const useComplaints = (initialFilters = {}) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    perPage: 10
  });

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const response = await complaintService.getAllComplaints({
        ...filters,
        page: pagination.page,
        per_page: pagination.perPage
      });
      
      setComplaints(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.meta?.total || 0
      }));
    } catch (err) {
      setError(err);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.perPage]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const createComplaint = async (complaintData) => {
    try {
      const response = await complaintService.createComplaint(complaintData);
      toast.success('Complaint created successfully');
      fetchComplaints();
      return response;
    } catch (err) {
      toast.error(err.message || 'Failed to create complaint');
      throw err;
    }
  };

  const updateStatus = async (id, status, remarks) => {
    try {
      const response = await complaintService.updateStatus(id, status, remarks);
      toast.success('Status updated successfully');
      fetchComplaints();
      return response;
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
      throw err;
    }
  };

  const addComment = async (id, comment) => {
    try {
      const response = await complaintService.addComment(id, comment);
      toast.success('Comment added successfully');
      fetchComplaints();
      return response;
    } catch (err) {
      toast.error(err.message || 'Failed to add comment');
      throw err;
    }
  };

  return {
    complaints,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    setPagination,
    fetchComplaints,
    createComplaint,
    updateStatus,
    addComment
  };
};