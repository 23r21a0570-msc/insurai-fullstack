import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getClaimsTrend, getRiskDistribution } from '@/lib/mockData';

const TOOLTIP_STYLE = { contentStyle: { backgroundColor: '#0F1629', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }, itemStyle: { color: '#d1d5db' } };

export const ClaimsTrendChart = ({ days = 15 }: { days?: number }) => {
  const data = getClaimsTrend(days);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradSubmitted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}   />
          </linearGradient>
          <linearGradient id="gradApproved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Area type="monotone" dataKey="submitted" stroke="#10B981" fill="url(#gradSubmitted)" strokeWidth={2} name="Submitted" />
        <Area type="monotone" dataKey="approved"  stroke="#3B82F6" fill="url(#gradApproved)"  strokeWidth={2} name="Approved"  />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const RiskDistributionChart = () => {
  const data = getRiskDistribution();
  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="count" nameKey="level">
            {data.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
          </Pie>
          <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [v, String(n).charAt(0).toUpperCase() + String(n).slice(1)]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
        {data.map(d => (
          <div key={d.level} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-gray-400 capitalize">{d.level} <span className="text-gray-600">({d.percentage}%)</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ClaimTypeChart = () => {
  const data = [
    { type: 'Auto', count: 18, color: '#10B981' },
    { type: 'Property', count: 12, color: '#3B82F6' },
    { type: 'Medical', count: 9, color: '#8B5CF6' },
    { type: 'Liability', count: 7, color: '#F59E0B' },
    { type: 'Disaster', count: 4, color: '#EF4444' },
    { type: 'Theft', count: 6, color: '#06B6D4' },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={24}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Claims">
          {data.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ClaimStatusChart = () => {
  const data = [
    { name: 'Approved',     value: 18, color: '#10B981' },
    { name: 'Under Review', value: 14, color: '#3B82F6' },
    { name: 'Pending Info', value: 9,  color: '#F59E0B' },
    { name: 'Rejected',     value: 6,  color: '#EF4444' },
    { name: 'Escalated',    value: 3,  color: '#8B5CF6' },
    { name: 'Submitted',    value: 5,  color: '#6B7280' },
  ];
  return (
    <div className="w-full h-full flex flex-col">
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name">
            {data.map((_, i) => <Cell key={i} fill={data[i].color} stroke="none" />)}
          </Pie>
          <Tooltip {...TOOLTIP_STYLE} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-[10px] text-gray-500">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FraudTrendChart = () => {
  const data = Array.from({ length: 12 }, (_, i) => {
    const m = new Date(); m.setMonth(m.getMonth() - (11 - i));
    return { month: m.toLocaleString('default', { month: 'short' }), detected: 2 + Math.floor(Math.random() * 8), resolved: 1 + Math.floor(Math.random() * 6) };
  });
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradDetected" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0}   />
          </linearGradient>
          <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 10 }} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#6b7280' }} />
        <Area type="monotone" dataKey="detected" stroke="#EF4444" fill="url(#gradDetected)" strokeWidth={2} name="Detected" />
        <Area type="monotone" dataKey="resolved"  stroke="#10B981" fill="url(#gradResolved)"  strokeWidth={2} name="Resolved"  />
      </AreaChart>
    </ResponsiveContainer>
  );
};
