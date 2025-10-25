"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { YearlyProjection } from '@/lib/projections';

interface ProjectionChartProps {
  data: YearlyProjection[];
}

export default function ProjectionChart({ data }: ProjectionChartProps) {
  // Format currency for tooltips
  const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString()}`;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">Year {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="year"
            label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
            stroke="#666"
          />
          <YAxis
            label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            stroke="#666"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="homeValue"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Home Value"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#10b981"
            strokeWidth={2}
            name="Equity"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="totalCashFlow"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Cumulative Cash Flow"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="totalReturn"
            stroke="#8b5cf6"
            strokeWidth={3}
            name="Total Return"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
