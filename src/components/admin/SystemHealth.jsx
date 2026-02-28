import React from 'react';
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react';

const SystemHealth = ({ metrics }) => {
  const getStatusColor = (value, thresholds) => {
    if (value < thresholds.warning) return 'text-green-600';
    if (value < thresholds.critical) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (value, thresholds) => {
    if (value < thresholds.warning) return 'bg-green-500';
    if (value < thresholds.critical) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      {/* CPU Usage */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">CPU Usage</span>
          </div>
          <span className={`text-sm font-semibold ${getStatusColor(metrics.cpu, { warning: 70, critical: 90 })}`}>
            {metrics.cpu}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor(metrics.cpu, { warning: 70, critical: 90 })}`}
            style={{ width: `${metrics.cpu}%` }}
          />
        </div>
      </div>

      {/* Memory Usage */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Memory Usage</span>
          </div>
          <span className={`text-sm font-semibold ${getStatusColor(metrics.memory, { warning: 75, critical: 90 })}`}>
            {metrics.memory}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor(metrics.memory, { warning: 75, critical: 90 })}`}
            style={{ width: `${metrics.memory}%` }}
          />
        </div>
      </div>

      {/* Storage Usage */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <HardDrive className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Storage Usage</span>
          </div>
          <span className={`text-sm font-semibold ${getStatusColor(metrics.storage, { warning: 80, critical: 95 })}`}>
            {metrics.storage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor(metrics.storage, { warning: 80, critical: 95 })}`}
            style={{ width: `${metrics.storage}%` }}
          />
        </div>
      </div>

      {/* API Latency */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">API Latency</span>
          </div>
          <span className={`text-sm font-semibold ${getStatusColor(metrics.apiLatency, { warning: 200, critical: 500 })}`}>
            {metrics.apiLatency}ms
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor(
              (metrics.apiLatency / 1000) * 100, 
              { warning: 20, critical: 50 }
            )}`}
            style={{ width: `${(metrics.apiLatency / 1000) * 100}%` }}
          />
        </div>
      </div>

      {/* System Status Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-green-50 text-green-700 p-2 rounded">
            <p className="font-medium">Uptime</p>
            <p>99.9%</p>
          </div>
          <div className="bg-blue-50 text-blue-700 p-2 rounded">
            <p className="font-medium">Requests</p>
            <p>1.2k/min</p>
          </div>
          <div className="bg-purple-50 text-purple-700 p-2 rounded">
            <p className="font-medium">Active Users</p>
            <p>156</p>
          </div>
          <div className="bg-orange-50 text-orange-700 p-2 rounded">
            <p className="font-medium">Error Rate</p>
            <p>0.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;