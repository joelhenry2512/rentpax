"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ExpenseBreakdownProps {
  piti: number;
  vacancy: number;
  maintenance: number;
  management: number;
  rentEstimate: number;
}

export default function ExpenseBreakdown({ 
  piti, 
  vacancy, 
  maintenance, 
  management, 
  rentEstimate 
}: ExpenseBreakdownProps) {
  const vacancyAmount = rentEstimate * (vacancy / 100);
  const maintenanceAmount = rentEstimate * (maintenance / 100);
  const managementAmount = rentEstimate * (management / 100);
  
  const data = [
    { name: 'Monthly Payment', value: piti, color: '#EF4444' },
    { name: 'Vacancy', value: vacancyAmount, color: '#F59E0B' },
    { name: 'Maintenance', value: maintenanceAmount, color: '#8B5CF6' },
    { name: 'Management', value: managementAmount, color: '#06B6D4' }
  ];

  const COLORS = ['#EF4444', '#F59E0B', '#8B5CF6', '#06B6D4'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(0)}`, 'Monthly Cost']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span style={{ color: '#374151', fontSize: '14px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
