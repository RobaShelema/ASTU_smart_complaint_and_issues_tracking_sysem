import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const StatusDistributionChart = ({ data = [] }) => {
  const COLORS = {
    pending: '#FBBF24',
    assigned: '#8B5CF6',
    in_progress: '#3B82F6',
    resolved: '#10B981',
    closed: '#6B7280',
    escalated: '#EF4444',
    on_hold: '#F59E0B',
    rejected: '#DC2626'
  };

  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status.replace('_', ' ').toUpperCase(),
    value: count,
    status
  }));

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No status data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#999'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StatusDistributionChart;