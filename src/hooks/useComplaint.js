import { useState, useEffect, useCallback } from 'react';
import { complaintService } from '../services/api/complaintService';
import toast from 'react-hot-toast';

export const useComplaint = (complaintId) => {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaint = useCallback(async () => {
    if (!complaintId) return;

    try {
      setLoading(true);
      const data = await complaintService.getById(complaintId);
      setComplaint(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load complaint');
    } finally {
      setLoading(false);
    }
  }, [complaintId]);

  useEffect(() => {
    fetchComplaint();
  }, [fetchComplaint]);

  const updateStatus = async (status, remarks) => {
    try {
      const updated = await complaintService.updateStatus(
        complaintId,
        status,
        remarks
      );
      setComplaint(updated);
      toast.success('Status updated successfully');
      return updated;
    } catch (err) {
      toast.error('Failed to update status');
      throw err;
    }
  };

  return {
    complaint,
    loading,
    error,
    updateStatus,
    refresh: fetchComplaint
  };
};