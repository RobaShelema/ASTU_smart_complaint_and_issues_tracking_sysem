import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const StatusProgress = ({ currentStatus }) => {
  const steps = [
    { key: 'pending', label: 'Submitted', description: 'Complaint received' },
    { key: 'assigned', label: 'Assigned', description: 'Assigned to staff' },
    { key: 'in_progress', label: 'In Progress', description: 'Being worked on' },
    { key: 'resolved', label: 'Resolved', description: 'Solution provided' },
    { key: 'closed', label: 'Closed', description: 'Complaint closed' }
  ];

  // Map status to step index
  const statusOrder = {
    'pending': 0,
    'assigned': 1,
    'in_progress': 2,
    'resolved': 3,
    'closed': 4,
    'escalated': 2, // Escalated maps to In Progress
    'on_hold': 1,   // On hold maps to Assigned
    'rejected': 0,  // Rejected maps to Pending
    'approved': 3   // Approved maps to Resolved
  };

  const currentStep = statusOrder[currentStatus] || 0;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.key} className="flex-1 text-center">
                <div className="relative">
                  {/* Step Icon */}
                  <div className={`flex items-center justify-center mx-auto mb-2 ${
                    isCompleted ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className={`h-6 w-6 ${isCurrent ? 'animate-pulse' : ''}`} />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </div>
                  
                  {/* Step Label */}
                  <div className={`text-xs font-medium ${
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </div>
                  
                  {/* Step Description */}
                  <div className="text-xs text-gray-400 mt-1 hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Details */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Current Status</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {currentStatus?.replace('_', ' ')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Progress</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.round((currentStep / (steps.length - 1)) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusProgress;