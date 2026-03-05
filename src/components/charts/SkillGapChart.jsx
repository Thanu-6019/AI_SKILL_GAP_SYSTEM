import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-lg">
        <p className="text-slate-100 font-semibold mb-2">{payload[0].payload.skill}</p>
        <p className="text-blue-400 text-sm">Current: {payload[0].value}%</p>
        <p className="text-purple-400 text-sm">Required: {payload[1].value}%</p>
        <p className="text-amber-400 text-sm">Gap: {payload[0].payload.gap}%</p>
      </div>
    );
  }
  return null;
};

const SkillGapChart = ({ data }) => {
  const defaultData = [
    { skill: 'React', current: 75, required: 90, gap: 15 },
    { skill: 'TypeScript', current: 60, required: 85, gap: 25 },
    { skill: 'Node.js', current: 70, required: 80, gap: 10 },
    { skill: 'Python', current: 50, required: 80, gap: 30 },
    { skill: 'AWS', current: 40, required: 75, gap: 35 },
    { skill: 'Docker', current: 65, required: 85, gap: 20 },
  ];

  const chartData = data || defaultData;

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis 
          dataKey="skill" 
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ color: '#94a3b8', fontSize: '14px' }}
          iconType="circle"
        />
        <Bar dataKey="current" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Current Level" />
        <Bar dataKey="required" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Required Level" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SkillGapChart;
