import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ComplaintsChart = ({ 
  data = [], 
  type = 'line',
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  colors = {
    submitted: '#3B82F6',
    resolved: '#10B981',
    pending: '#F59E0B',
    inProgress: '#8B5CF6'
  }
}) => {
  const renderChart = () => {
    switch(type) {
      case 'area':
        return (
          <AreaChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                color: '#F9FAFB',
                border: 'none',
                borderRadius: '8px',
                padding: '8px'
              }}
              labelStyle={{ color: '#F9FAFB', fontWeight: 'bold' }}
            />}
            {showLegend && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
            <Area 
              type="monotone" 
              dataKey="submitted" 
              stackId="1"
              stroke={colors.submitted} 
              fill={colors.submitted} 
              fillOpacity={0.3}
              name="Submitted"
            />
            <Area 
              type="monotone" 
              dataKey="resolved" 
              stackId="2"
              stroke={colors.resolved} 
              fill={colors.resolved} 
              fillOpacity={0.3}
              name="Resolved"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                color: '#F9FAFB',
                border: 'none',
                borderRadius: '8px',
                padding: '8px'
              }}
            />}
            {showLegend && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
            <Bar dataKey="submitted" fill={colors.submitted} name="Submitted" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resolved" fill={colors.resolved} name="Resolved" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      default:
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            {showTooltip && <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                color: '#F9FAFB',
                border: 'none',
                borderRadius: '8px',
                padding: '8px'
              }}
              labelStyle={{ color: '#F9FAFB', fontWeight: 'bold' }}
            />}
            {showLegend && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
            <Line 
              type="monotone" 
              dataKey="submitted" 
              stroke={colors.submitted} 
              strokeWidth={2}
              dot={{ r: 4, fill: colors.submitted }}
              activeDot={{ r: 6 }}
              name="Submitted"
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke={colors.resolved} 
              strokeWidth={2}
              dot={{ r: 4, fill: colors.resolved }}
              activeDot={{ r: 6 }}
              name="Resolved"
            />
          </LineChart>
        );
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default ComplaintsChart;