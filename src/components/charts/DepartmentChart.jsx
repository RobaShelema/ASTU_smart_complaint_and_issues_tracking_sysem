import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const DepartmentChart = ({ 
  data = [], 
  type = 'bar',
  height = 300,
  showValues = true
}) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{payload[0].payload.name || label}</p>
          <p className="text-sm text-blue-300">
            Complaints: {payload[0].value}
          </p>
          {payload[0].payload.resolved && (
            <p className="text-sm text-green-300">
              Resolved: {payload[0].payload.resolved}
            </p>
          )}
          {payload[0].payload.resolutionRate && (
            <p className="text-sm text-yellow-300">
              Rate: {payload[0].payload.resolutionRate}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderBarChart = () => (
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} angle={-45} textAnchor="end" height={60} />
      <YAxis stroke="#6B7280" fontSize={12} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
      <Bar dataKey="complaints" fill="#3B82F6" name="Total Complaints" radius={[4, 4, 0, 0]} />
      <Bar dataKey="resolved" fill="#10B981" name="Resolved" radius={[4, 4, 0, 0]} />
    </BarChart>
  );

  const renderPieChart = () => (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="complaints"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  );

  const renderHorizontalBar = () => (
    <BarChart
      layout="vertical"
      data={data}
      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis type="number" stroke="#6B7280" fontSize={12} />
      <YAxis type="category" dataKey="name" stroke="#6B7280" fontSize={12} width={80} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
      <Bar dataKey="complaints" fill="#3B82F6" name="Complaints" radius={[0, 4, 4, 0]} />
    </BarChart>
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-400">No department data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === 'pie' ? renderPieChart() : type === 'horizontal' ? renderHorizontalBar() : renderBarChart()}
    </ResponsiveContainer>
  );
};

export default DepartmentChart;