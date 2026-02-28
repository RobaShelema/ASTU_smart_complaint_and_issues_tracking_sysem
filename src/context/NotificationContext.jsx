import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Create context
const NotificationContext = createContext(null);

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
  COMPLAINT_UPDATE: 'complaint_update',
  NEW_COMPLAINT: 'new_complaint',
  ASSIGNMENT: 'assignment',
  REMINDER: 'reminder'
};

// Notification priorities
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState(null);

  // Load initial notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user) return;

    // Connect to WebSocket server
    const connectWebSocket = () => {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
      const websocket = new WebSocket(`${wsUrl}?token=${localStorage.getItem('token')}`);

      websocket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          handleIncomingNotification(notification);
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      return websocket;
    };

    const websocket = connectWebSocket();

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [user]);

  // Handle incoming notification
  const handleIncomingNotification = useCallback((notification) => {
    const newNotification = {
      id: notification.id || Date.now().toString(),
      type: notification.type || NOTIFICATION_TYPES.INFO,
      priority: notification.priority || NOTIFICATION_PRIORITY.MEDIUM,
      title: notification.title,
      message: notification.message,
      timestamp: new Date().toISOString(),
      read: false,
      data: notification.data || {},
      actionable: notification.actionable || false,
      actions: notification.actions || []
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50 notifications

    // Show toast based on priority
    switch(newNotification.priority) {
      case NOTIFICATION_PRIORITY.URGENT:
        toast.error(newNotification.title || newNotification.message, {
          duration: 6000,
          icon: '🔴'
        });
        break;
      case NOTIFICATION_PRIORITY.HIGH:
        toast.error(newNotification.message, {
          duration: 5000,
          icon: '⚠️'
        });
        break;
      case NOTIFICATION_PRIORITY.MEDIUM:
        toast.success(newNotification.message, {
          icon: '📢'
        });
        break;
      default:
        toast(newNotification.message, {
          icon: 'ℹ️'
        });
    }

    // Play sound for urgent notifications
    if (newNotification.priority === NOTIFICATION_PRIORITY.URGENT) {
      playNotificationSound();
    }
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(error => console.log('Audio playback failed:', error));
  }, []);

  // Add notification manually
  const addNotification = useCallback((notification) => {
    handleIncomingNotification(notification);
  }, [handleIncomingNotification]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Remove single notification
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  }, []);

  // Get notifications by type
  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  // Send notification via WebSocket
  const sendNotification = useCallback((notification, targetUserId = null) => {
    if (ws && isConnected) {
      ws.send(JSON.stringify({
        type: 'notification',
        target: targetUserId,
        notification
      }));
    } else {
      console.warn('WebSocket not connected');
      // Fallback to local notification
      handleIncomingNotification(notification);
    }
  }, [ws, isConnected, handleIncomingNotification]);

  // Complaint-specific notifications
  const notifyComplaintUpdate = useCallback((complaintId, status, message) => {
    const notification = {
      type: NOTIFICATION_TYPES.COMPLAINT_UPDATE,
      priority: NOTIFICATION_PRIORITY.MEDIUM,
      title: 'Complaint Updated',
      message: message || `Your complaint #${complaintId} status changed to ${status}`,
      data: { complaintId, status }
    };
    addNotification(notification);
  }, [addNotification]);

  const notifyNewAssignment = useCallback((complaintId, staffName) => {
    const notification = {
      type: NOTIFICATION_TYPES.ASSIGNMENT,
      priority: NOTIFICATION_PRIORITY.HIGH,
      title: 'New Assignment',
      message: `Complaint #${complaintId} has been assigned to you`,
      data: { complaintId, staffName }
    };
    addNotification(notification);
  }, [addNotification]);

  const notifyNewComplaint = useCallback((complaintId, studentName) => {
    const notification = {
      type: NOTIFICATION_TYPES.NEW_COMPLAINT,
      priority: NOTIFICATION_PRIORITY.HIGH,
      title: 'New Complaint Filed',
      message: `New complaint #${complaintId} filed by ${studentName}`,
      data: { complaintId, studentName }
    };
    addNotification(notification);
  }, [addNotification]);

  const value = {
    // State
    notifications,
    unreadCount,
    isConnected,
    
    // Core functions
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification,
    sendNotification,
    
    // Getters
    getNotificationsByType,
    getUnreadNotifications,
    
    // Complaint-specific
    notifyComplaintUpdate,
    notifyNewAssignment,
    notifyNewComplaint,
    
    // Connection status
    isConnected
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for using notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};