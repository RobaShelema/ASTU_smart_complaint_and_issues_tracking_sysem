import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format, parseISO } from 'date-fns';

const TrendsChart = ({ 
  data = [], 
  type = 'line',
  height = 300,
  showAverage = true,
  showProjection = false,
  timeRange = 'month'
}) => {
  // Calculate moving average
  const calculateMovingAverage = (data, window = 7) => {
    return data.map((item, index) => {
      const start = Math.max(0, index - window + 1);
      const end = index + 1;
      const windowData = data.slice(start, end);
      const avg = windowData.reduce((sum, d) => sum + d.value, 0) / windowData.length;
      return {
        ...item,
        movingAvg: Math.round(avg * 10) / 10
      };
    });
  };

  // Calculate trend line
  const calculateTrend = (data) => {
    if (data.length < 2) return data;
    
    const xValues = data.map((_, i) => i);
    const yValues = data.map(d => d.value);
    
    const n = data.length;
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return data.map((item, i) => ({
      ...item,
      trend: Math.round((slope * i + intercept) * 10) / 10
    }));
  };

  const processedData = showAverage ? calculateMovingAverage(data) : data;
  const trendData = showProjection ? calculateTrend(processedData) : processedData;

  const formatXAxis = (tickItem) => {
    if (timeRange === 'day') {
      return format(parseISO(tickItem), 'HH:mm');
    } else if (timeRange === 'week') {
      return format(parseISO(tickItem), 'EEE');
    } else if (timeRange === 'month') {
      return format(parseISO(tickItem), 'dd MMM');
    } else {
      return format(parseISO(tickItem), 'MMM yyyy');
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg">
          <p className="text-sm font-semibold">{format(parseISO(label), 'PPP')}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderLineChart = () => (
    <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis 
        dataKey="date" 
        tickFormatter={formatXAxis}
        stroke="#6B7280" 
        fontSize={12}
      />
      <YAxis stroke="#6B7280" fontSize={12} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
      
      <Line 
        type="monotone" 
        dataKey="value" 
        stroke="#3B82F6" 
        strokeWidth={2}
        dot={{ r: 3, fill: '#3B82F6' }}
        activeDot={{ r: 5 }}
        name="Actual"
      />
      
      {showAverage && (
        <Line 
          type="monotone" 
          dataKey="movingAvg" 
          stroke="#F59E0B" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name="Moving Average (7-day)"
        />
      )}
      
      {showProjection && (
        <Line 
          type="monotone" 
          dataKey="trend" 
          stroke="#10B981" 
          strokeWidth={2}
          strokeDasharray="3 3"
          dot={false}
          name="Trend Line"
        />
      )}
      
      <ReferenceLine y={0} stroke="#E5E7EB" />
    </LineChart>
  );

  const renderAreaChart = () => (
    <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis 
        dataKey="date" 
        tickFormatter={formatXAxis}
        stroke="#6B7280" 
        fontSize={12}
      />
      <YAxis stroke="#6B7280" fontSize={12} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
      
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke="#3B82F6" 
        fill="#3B82F6" 
        fillOpacity={0.3}
        name="Complaints"
      />
    </AreaChart>
  );

  const renderComposedChart = () => (
    <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis 
        dataKey="date" 
        tickFormatter={formatXAxis}
        stroke="#6B7280" 
        fontSize={12}
      />
      <YAxis stroke="#6B7280" fontSize={12} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
      
      <Bar dataKey="value" fill="#3B82F6" name="Complaints" radius={[4, 4, 0, 0]} />
      
      {showAverage && (
        <Line 
          type="monotone" 
          dataKey="movingAvg" 
          stroke="#F59E0B" 
          strokeWidth={2}
          name="Moving Average"
        />
      )}
    </ComposedChart>
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-400">No trend data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === 'area' ? renderAreaChart() : type === 'composed' ? renderComposedChart() : renderLineChart()}
    </ResponsiveContainer>
  );
};

export default TrendsChart;