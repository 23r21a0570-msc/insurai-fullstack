import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getClaimsTrend } from '@/data/mockData';
import { format, parseISO } from 'date-fns';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0F1629] p-3 shadow-2xl text-xs">
      <p className="mb-2 font-semibold text-gray-400">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-400 capitalize">{entry.name}:</span>
          <span className="font-bold text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const ClaimsTrendChart = ({ days = 30 }: { days?: number }) => {
  const data = getClaimsTrend(days).map((d) => ({
    ...d,
    date: format(parseISO(d.date), 'MMM d'),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradSubmitted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradFlagged" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#4B5563', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={Math.floor(data.length / 6)}
        />
        <YAxis
          tick={{ fill: '#4B5563', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
        <Legend
          wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
          formatter={(value) => <span style={{ color: '#6B7280', textTransform: 'capitalize' }}>{value}</span>}
        />
        <Area type="monotone" dataKey="submitted" stroke="#10B981" strokeWidth={1.5} fill="url(#gradSubmitted)" dot={false} />
        <Area type="monotone" dataKey="approved" stroke="#3B82F6" strokeWidth={1.5} fill="url(#gradApproved)" dot={false} />
        <Area type="monotone" dataKey="flagged" stroke="#F59E0B" strokeWidth={1.5} fill="url(#gradFlagged)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
