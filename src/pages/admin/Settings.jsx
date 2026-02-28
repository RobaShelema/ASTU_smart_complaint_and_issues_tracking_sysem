import React, { useState } from 'react';
import { adminService } from '../../services/api/adminService';
import {
  Save,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Clock,
  Users,
  Lock,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    general: {
      siteName: 'ASTU Complaint System',
      siteUrl: 'https://complaints.astu.edu.et',
      adminEmail: 'admin@astu.edu.et',
      timezone: 'Africa/Addis_Ababa',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',
      language: 'en'
    },
    
    // Notification Settings
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      notifyOnNewComplaint: true,
      notifyOnStatusChange: true,
      notifyOnAssignment: true,
      notifyOnEscalation: true,
      dailyDigest: true,
      weeklyReport: true
    },
    
    // Security Settings
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      requireEmailVerification: true,
      ipWhitelist: [],
      allowedDomains: ['astu.edu.et']
    },
    
    // Complaint Settings
    complaints: {
      autoAssign: true,
      escalationHours: 48,
      maxAttachments: 5,
      maxFileSize: 5,
      allowAnonymous: false,
      requireLocation: true,
      defaultPriority: 'medium',
      enableCategories: true
    },
    
    // System Settings
    system: {
      maintenanceMode: false,
      debugMode: false,
      logRetention: 30,
      backupFrequency: 'daily',
      backupTime: '02:00',
      cacheEnabled: true,
      cacheTTL: 3600
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'complaints', label: 'Complaints', icon: Database },
    { id: 'system', label: 'System', icon: Settings }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      await adminService.createBackup();
      toast.success('Backup created successfully');
    } catch (error) {
      toast.error('Failed to create backup');
    }
  };

  const handleClearCache = async () => {
    try {
      await adminService.clearCache();
      toast.success('Cache cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure system preferences and options
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={settings.general.siteUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteUrl: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.adminEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, adminEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, timezone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Africa/Addis_Ababa">Addis Ababa (UTC+3)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">New York (UTC-5)</option>
                    <option value="Europe/London">London (UTC+0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    value={settings.general.dateFormat}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, dateFormat: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="YYYY-MM-DD">2024-01-31</option>
                    <option value="DD/MM/YYYY">31/01/2024</option>
                    <option value="MM/DD/YYYY">01/31/2024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Format
                  </label>
                  <select
                    value={settings.general.timeFormat}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, timeFormat: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="24h">24-hour (14:30)</option>
                    <option value="12h">12-hour (2:30 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, language: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="en">English</option>
                    <option value="am">አማርኛ (Amharic)</option>
                    <option value="om">Afaan Oromoo</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-500">Send notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                    })}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Push Notifications</p>
                    <p className="text-sm text-gray-500">Browser push notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushNotifications: e.target.checked }
                    })}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Text message alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, smsNotifications: e.target.checked }
                    })}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Daily Digest</p>
                    <p className="text-sm text-gray-500">Daily summary email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.dailyDigest}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, dailyDigest: e.target.checked }
                    })}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                </label>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Notification Triggers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications.notifyOnNewComplaint}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, notifyOnNewComplaint: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">New complaint submitted</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications.notifyOnStatusChange}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, notifyOnStatusChange: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Status changes</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications.notifyOnAssignment}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, notifyOnAssignment: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Complaint assignment</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications.notifyOnEscalation}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, notifyOnEscalation: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Escalation</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, passwordExpiry: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed Domains
                  </label>
                  <input
                    type="text"
                    value={settings.security.allowedDomains.join(', ')}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, allowedDomains: e.target.value.split(',').map(d => d.trim()) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="astu.edu.et, example.com"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, twoFactorAuth: e.target.checked }
                      })}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">Email Verification</p>
                      <p className="text-sm text-gray-500">Require email verification for new accounts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.requireEmailVerification}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, requireEmailVerification: e.target.checked }
                      })}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Complaint Settings */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Escalation Time (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={settings.complaints.escalationHours}
                    onChange={(e) => setSettings({
                      ...settings,
                      complaints: { ...settings.complaints, escalationHours: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Attachments
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.complaints.maxAttachments}
                    onChange={(e) => setSettings({
                      ...settings,
                      complaints: { ...settings.complaints, maxAttachments: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max File Size (MB)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={settings.complaints.maxFileSize}
                    onChange={(e) => setSettings({
                      ...settings,
                      complaints: { ...settings.complaints, maxFileSize: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Priority
                  </label>
                  <select
                    value={settings.complaints.defaultPriority}
                    onChange={(e) => setSettings({
                      ...settings,
                      complaints: { ...settings.complaints, defaultPriority: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">Auto-assign Complaints</p>
                      <p className="text-sm text-gray-500">Automatically assign to available staff</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.complaints.autoAssign}
                      onChange={(e) => setSettings({
                        ...settings,
                        complaints: { ...settings.complaints, autoAssign: e.target.checked }
                      })}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">Require Location</p>
                      <p className="text-sm text-gray-500">Make location field required</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.complaints.requireLocation}
                      onChange={(e) => setSettings({
                        ...settings,
                        complaints: { ...settings.complaints, requireLocation: e.target.checked }
                      })}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">Allow Anonymous</p>
                      <p className="text-sm text-gray-500">Allow anonymous complaints</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.complaints.allowAnonymous}
                      onChange={(e) => setSettings({
                        ...settings,
                        complaints: { ...settings.complaints, allowAnonymous: e.target.checked }
                      })}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Log Retention (days)
                  </label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    value={settings.system.logRetention}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, logRetention: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.system.backupFrequency}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, backupFrequency: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Backup Time
                  </label>
                  <input
                    type="time"
                    value={settings.system.backupTime}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, backupTime: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cache TTL (seconds)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="86400"
                    value={settings.system.cacheTTL}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: { ...settings.system, cacheTTL: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">Maintenance Mode</p>
                      <p className="text-sm text-gray-500">Put system in maintenance mode</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.system.maintenanceMode}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, maintenanceMode: e.target.checked }
                      })}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">Debug Mode</p>
                      <p className="text-sm text-gray-500">Enable debug logging</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.system.debugMode}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, debugMode: e.target.checked }
                      })}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-700">Enable Cache</p>
                      <p className="text-sm text-gray-500">Cache system data</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.system.cacheEnabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        system: { ...settings.system, cacheEnabled: e.target.checked }
                      })}
                      className="h-5 w-5 text-blue-600 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* System Actions */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">System Actions</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={handleBackup}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Database className="h-4 w-4" />
                    <span>Create Backup</span>
                  </button>
                  
                  <button
                    onClick={handleClearCache}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Clear Cache</span>
                  </button>
                </div>
              </div>

              {/* System Status */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">Database</p>
                        <p className="text-lg font-semibold text-green-700">Connected</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">Cache Service</p>
                        <p className="text-lg font-semibold text-green-700">Operational</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600">Storage</p>
                        <p className="text-lg font-semibold text-green-700">68% Used</p>
                      </div>
                      <Database className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow border border-red-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Reset System Data</p>
                  <p className="text-sm text-gray-500">
                    Permanently delete all complaints and reset the system to default state
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Reset System
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Delete Inactive Users</p>
                  <p className="text-sm text-gray-500">
                    Remove all users who haven't logged in for over 6 months
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;