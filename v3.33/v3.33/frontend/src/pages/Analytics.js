import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Analytics = () => {
  // Sample data - replace with actual data from your API
  const modelUsageData = [
    { name: 'llama2', usage: 150 },
    { name: 'codellama', usage: 120 },
    { name: 'mistral', usage: 80 },
    { name: 'vicuna', usage: 60 },
    { name: 'orca-mini', usage: 40 },
  ];

  const webTrafficData = [
    { date: '2024-01', visits: 1200 },
    { date: '2024-02', visits: 1900 },
    { date: '2024-03', visits: 2400 },
    { date: '2024-04', visits: 2800 },
    { date: '2024-05', visits: 3500 },
    { date: '2024-06', visits: 4000 },
  ];

  const modelPerformanceData = [
    { time: '1h', speed: 95, accuracy: 92 },
    { time: '6h', speed: 88, accuracy: 94 },
    { time: '12h', speed: 92, accuracy: 90 },
    { time: '24h', speed: 85, accuracy: 96 },
    { time: '48h', speed: 90, accuracy: 93 },
  ];

  const chartStyle = {
    background: '#000000',
    border: '2px solid #FFFFFF',
    borderRadius: '0.5rem',
    padding: '1rem',
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-white mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Model Usage Chart */}
        <div style={chartStyle} className="p-4">
          <h2 className="text-lg font-medium text-white mb-4">Top Model Usage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.1} />
              <XAxis dataKey="name" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#000000', border: '1px solid #FFFFFF' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Legend wrapperStyle={{ color: '#FFFFFF' }} />
              <Bar dataKey="usage" fill="#FFFFFF" name="Usage Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Web Traffic Chart */}
        <div style={chartStyle} className="p-4">
          <h2 className="text-lg font-medium text-white mb-4">Web Traffic</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={webTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.1} />
              <XAxis dataKey="date" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#000000', border: '1px solid #FFFFFF' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Legend wrapperStyle={{ color: '#FFFFFF' }} />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#FFFFFF"
                name="Monthly Visits"
                dot={{ fill: '#FFFFFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Model Performance Chart */}
        <div style={chartStyle} className="p-4 lg:col-span-2">
          <h2 className="text-lg font-medium text-white mb-4">Model Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={modelPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF" opacity={0.1} />
              <XAxis dataKey="time" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#000000', border: '1px solid #FFFFFF' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Legend wrapperStyle={{ color: '#FFFFFF' }} />
              <Line
                type="monotone"
                dataKey="speed"
                stroke="#FFFFFF"
                name="Processing Speed"
                dot={{ fill: '#FFFFFF' }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#808080"
                name="Accuracy"
                dot={{ fill: '#808080' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
