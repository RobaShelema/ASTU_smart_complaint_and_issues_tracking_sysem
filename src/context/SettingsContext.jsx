import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Create context
const SettingsContext = createContext(null);

// Custom hook
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

// Default settings
const DEFAULT_SETTINGS = {
  // General settings
  general: {
    language: 'en',
    timezone: 'Africa/Addis_Ababa',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    itemsPerPage: 10
  },
  
  // Notification settings
  notifications: {
    email: true,
    push: true,
    sound: true,
    desktop: true,
    inApp: true,
    digest: 'daily',
    types: {
      complaintUpdate: true,
      newAssignment: true,
      escalation: true,
      resolution: true,
      system: true
    }
  },
  
  // Privacy settings
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    analytics: true
  },
  
  // Accessibility settings
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReader: false
  },
  
  // Display settings
  display: {
    compactMode: false,
    showAvatars: true,
    showAnimations: true,
    sidebarCollapsed: false
  }
};

export const SettingsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [settings, setSettings] = useState(() => {
    // Load from localStorage first
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Load user-specific settings from API when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserSettings();
    }
  }, [isAuthenticated, user]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  // Load user settings from API
  const loadUserSettings = async () => {
    try {
      // API call to get user settings
      // const response = await settingsService.getUserSettings(user.id);
      // if (response) {
      //   setSettings(prev => ({ ...prev, ...response }));
      // }
    } catch (error) {
      console.error('Failed to load user settings:', error);
    }
  };

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // Update specific section
  const updateSection = useCallback((section, values) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...values
      }
    }));
  }, []);

  // Reset settings to default
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  // Reset specific section
  const resetSection = useCallback((section) => {
    setSettings(prev => ({
      ...prev,
      [section]: DEFAULT_SETTINGS[section]
    }));
  }, []);

  // Save settings to API
  const saveSettings = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      // API call to save settings
      // await settingsService.saveUserSettings(user.id, settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [isAuthenticated, settings]);

  // Get setting value
  const getSetting = useCallback((path, defaultValue = null) => {
    const parts = path.split('.');
    let value = settings;
    
    for (const part of parts) {
      if (value === undefined || value === null) return defaultValue;
      value = value[part];
    }
    
    return value !== undefined ? value : defaultValue;
  }, [settings]);

  // Check if a feature is enabled
  const isEnabled = useCallback((feature) => {
    return getSetting(`features.${feature}`, true);
  }, [getSetting]);

  // Context value
  const value = {
    // State
    settings,
    
    // Actions
    updateSettings,
    updateSection,
    resetSettings,
    resetSection,
    saveSettings,
    
    // Getters
    getSetting,
    isEnabled,
    
    // Helper properties
    language: settings.general.language,
    timezone: settings.general.timezone,
    dateFormat: settings.general.dateFormat,
    itemsPerPage: settings.general.itemsPerPage
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};