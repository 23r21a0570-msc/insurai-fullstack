import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getRiskDistribution } from '@/data/mockData';

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { level: string; count: number; percentage: number; color: string } }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0F1629] p-3 shadow-2xl text-xs">
      <div className="flex items-center gap-2 mb-1">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
        <span className="font-bold text-white capitalize">{d.level} Risk</span>
      </div>
      <p className="text-gray-400">{d.count} claims · {d.percentage}%</p>
    </div>
  );
};

export const RiskDistributionChart = () => {
  const data = getRiskDistribution();

  return (
    <div className="h-full flex flex-col">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                strokeWidth={0}
                opacity={0.9}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((d) => (
          <div
            key={d.level}
            className="flex items-center gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2"
          >
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <div className="min-w-0">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider capitalize">{d.level}</p>
              <p className="text-sm font-bold text-white tabular-nums">{d.count} <span className="text-xs text-gray-600 font-normal">({d.percentage}%)</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
