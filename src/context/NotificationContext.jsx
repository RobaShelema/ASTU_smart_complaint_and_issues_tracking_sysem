import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Create context
const NotificationContext = createContext(null);

// Custom hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
  COMPLAINT_UPDATE: 'complaint_update',
  NEW_COMPLAINT: 'new_complaint',
  ASSIGNMENT: 'assignment',
  REMINDER: 'reminder',
  ESCALATION: 'escalation',
  RESOLUTION: 'resolution'
};

// Notification priorities
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [preferences, setPreferences] = useState({
    sound: true,
    desktop: true,
    email: true,
    inApp: true
  });

  // Refs
  const wsRef = useRef(null);
  const audioRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } catch (error) {
        console.error('Failed to parse saved notifications:', error);
      }
    }

    // Load preferences
    const savedPrefs = localStorage.getItem('notificationPrefs');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (error) {
        console.error('Failed to parse preferences:', error);
      }
    }

    // Initialize audio
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notification.mp3');
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('notificationPrefs', JSON.stringify(preferences));
  }, [preferences]);

  // WebSocket connection
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const connectWebSocket = () => {
      try {
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
        const token = localStorage.getItem('token');
        
        const ws = new WebSocket(`${wsUrl}?token=${token}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          setConnectionError(null);
          
          // Send authentication
          ws.send(JSON.stringify({
            type: 'auth',
            userId: user.id,
            role: user.role
          }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleIncomingNotification(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionError('Connection error');
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          
          // Attempt to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 5000);
        };
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setConnectionError('Failed to connect');
        
        // Attempt to reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 10000);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isAuthenticated, user]);

  // Handle incoming notification
  const handleIncomingNotification = useCallback((data) => {
    const newNotification = {
      id: data.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: data.type || NOTIFICATION_TYPES.INFO,
      priority: data.priority || NOTIFICATION_PRIORITY.MEDIUM,
      title: data.title || 'New Notification',
      message: data.message,
      timestamp: data.timestamp || new Date().toISOString(),
      read: false,
      data: data.data || {},
      actionable: data.actionable || false,
      actions: data.actions || [],
      link: data.link || null
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Keep last 100

    // Show toast based on priority
    if (preferences.inApp) {
      switch(newNotification.priority) {
        case NOTIFICATION_PRIORITY.URGENT:
          toast.error(newNotification.message, {
            duration: 6000,
            icon: '🔴',
            id: newNotification.id
          });
          break;
        case NOTIFICATION_PRIORITY.HIGH:
          toast.error(newNotification.message, {
            duration: 5000,
            icon: '⚠️',
            id: newNotification.id
          });
          break;
        case NOTIFICATION_PRIORITY.MEDIUM:
          toast.success(newNotification.message, {
            icon: '📢',
            id: newNotification.id
          });
          break;
        default:
          toast(newNotification.message, {
            icon: 'ℹ️',
            id: newNotification.id
          });
      }
    }

    // Play sound for high priority
    if (preferences.sound && ['urgent', 'high'].includes(newNotification.priority)) {
      playNotificationSound();
    }

    // Show desktop notification
    if (preferences.desktop && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/icon.png',
        tag: newNotification.id
      });
    }
  }, [preferences]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Failed to play notification sound:', error);
      });
    }
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

  // Get notifications by priority
  const getNotificationsByPriority = useCallback((priority) => {
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  // Send notification via WebSocket
  const sendNotification = useCallback((notification, targetUserId = null, targetRole = null) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify({
        type: 'notification',
        targetUserId,
        targetRole,
        notification: {
          ...notification,
          timestamp: new Date().toISOString()
        }
      }));
    } else {
      console.warn('WebSocket not connected');
      // Fallback to local notification
      handleIncomingNotification(notification);
    }
  }, [isConnected, handleIncomingNotification]);

  // Update preferences
  const updatePreferences = useCallback((newPreferences) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  }, []);

  // Complaint-specific notifications
  const notifyComplaintUpdate = useCallback((complaintId, status, message) => {
    const notification = {
      type: NOTIFICATION_TYPES.COMPLAINT_UPDATE,
      priority: status === 'escalated' ? NOTIFICATION_PRIORITY.HIGH : NOTIFICATION_PRIORITY.MEDIUM,
      title: 'Complaint Updated',
      message: message || `Your complaint #${complaintId} status changed to ${status}`,
      data: { complaintId, status },
      link: `/student/complaints/${complaintId}`,
      actionable: true,
      actions: [
        { label: 'View Details', action: 'view', link: `/student/complaints/${complaintId}` }
      ]
    };
    addNotification(notification);
  }, [addNotification]);

  const notifyNewAssignment = useCallback((complaintId, staffName) => {
    const notification = {
      type: NOTIFICATION_TYPES.ASSIGNMENT,
      priority: NOTIFICATION_PRIORITY.HIGH,
      title: 'New Assignment',
      message: `Complaint #${complaintId} has been assigned to you`,
      data: { complaintId, staffName },
      link: `/staff/complaints/${complaintId}`,
      actionable: true,
      actions: [
        { label: 'View Complaint', action: 'view', link: `/staff/complaints/${complaintId}` }
      ]
    };
    addNotification(notification);
  }, [addNotification]);

  const notifyNewComplaint = useCallback((complaintId, studentName) => {
    const notification = {
      type: NOTIFICATION_TYPES.NEW_COMPLAINT,
      priority: NOTIFICATION_PRIORITY.HIGH,
      title: 'New Complaint Filed',
      message: `New complaint #${complaintId} filed by ${studentName}`,
      data: { complaintId, studentName },
      link: `/admin/complaints/${complaintId}`,
      actionable: true,
      actions: [
        { label: 'Review', action: 'view', link: `/admin/complaints/${complaintId}` }
      ]
    };
    addNotification(notification);
  }, [addNotification]);

  const notifyEscalation = useCallback((complaintId, reason) => {
    const notification = {
      type: NOTIFICATION_TYPES.ESCALATION,
      priority: NOTIFICATION_PRIORITY.URGENT,
      title: 'Complaint Escalated',
      message: `Complaint #${complaintId} has been escalated: ${reason}`,
      data: { complaintId, reason },
      link: `/admin/complaints/${complaintId}`,
      actionable: true,
      actions: [
        { label: 'Review Escalation', action: 'view', link: `/admin/complaints/${complaintId}` }
      ]
    };
    addNotification(notification);
  }, [addNotification]);

  const notifyResolution = useCallback((complaintId, resolution) => {
    const notification = {
      type: NOTIFICATION_TYPES.RESOLUTION,
      priority: NOTIFICATION_PRIORITY.MEDIUM,
      title: 'Complaint Resolved',
      message: `Complaint #${complaintId} has been resolved. Please provide feedback.`,
      data: { complaintId, resolution },
      link: `/student/complaints/${complaintId}`,
      actionable: true,
      actions: [
        { label: 'View Resolution', action: 'view', link: `/student/complaints/${complaintId}` },
        { label: 'Provide Feedback', action: 'feedback', link: `/student/complaints/${complaintId}/feedback` }
      ]
    };
    addNotification(notification);
  }, [addNotification]);

  // Context value
  const value = {
    // State
    notifications,
    unreadCount,
    isConnected,
    connectionError,
    preferences,
    
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
    getNotificationsByPriority,
    
    // Complaint-specific
    notifyComplaintUpdate,
    notifyNewAssignment,
    notifyNewComplaint,
    notifyEscalation,
    notifyResolution,
    
    // Preferences
    updatePreferences,
    requestNotificationPermission,
    
    // Connection status
    isConnected
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};