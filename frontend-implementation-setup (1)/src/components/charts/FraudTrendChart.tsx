import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateData = () =>
  Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      flagged: Math.floor(Math.random() * 15) + 3,
      confirmed: Math.floor(Math.random() * 8) + 1,
    };
  });

const data = generateData();

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/[0.10] bg-[#0F1629] p-3 shadow-xl">
      <p className="text-xs font-bold text-gray-400 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-400 capitalize">{p.name}:</span>
          <span className="font-bold text-gray-200">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export const FraudTrendChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradFlagged" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradConfirmed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#4B5563', fontSize: 10 }}
          dy={8}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="flagged"
          stroke="#EF4444"
          strokeWidth={2}
          fill="url(#gradFlagged)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="confirmed"
          stroke="#F59E0B"
          strokeWidth={2}
          fill="url(#gradConfirmed)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
