import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    gray: 'bg-gray-50 text-gray-600'
  };

  const isPositiveTrend = trend && !trend.startsWith('-');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        {trend && (
          <div className={`flex items-center text-xs sm:text-sm ${
            isPositiveTrend ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositiveTrend ? (
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{title}</p>
    </div>
  );
};

export default StatsCard;