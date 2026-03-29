import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockClaims } from '@/data/mockData';

const buildData = () => {
  const statuses = ['submitted', 'under_review', 'pending_info', 'approved', 'rejected', 'escalated'];
  const colors = ['#6B7280', '#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];
  const labels = ['Submitted', 'In Review', 'Pending', 'Approved', 'Rejected', 'Escalated'];

  return statuses.map((s, i) => ({
    name: labels[i],
    count: mockClaims.filter((c) => c.status === s).length,
    color: colors[i],
  }));
};

const data = buildData();

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/[0.10] bg-[#0F1629] p-3 shadow-xl">
      <p className="text-xs font-bold text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-200">{payload[0].value} claims</p>
    </div>
  );
};

export const ClaimStatusChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#4B5563', fontSize: 9 }}
          dy={8}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
