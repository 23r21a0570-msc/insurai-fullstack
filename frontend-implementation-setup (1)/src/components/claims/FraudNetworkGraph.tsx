import { useState } from 'react';
import { Network, AlertTriangle, User, Phone, MapPin, CreditCard, Shield, Eye } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/utils/cn';
import { mockClaims } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

interface NetworkNode {
  id: string;
  type: 'claimant' | 'phone' | 'address' | 'vehicle' | 'shop' | 'adjuster';
  label: string;
  riskScore: number;
  connections: number;
}

interface NetworkEdge {
  from: string;
  to: string;
  type: string;
  weight: number;
}

interface FraudRing {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium';
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  totalAmount: number;
  claimsInvolved: number;
  detectedAt: string;
  description: string;
  indicators: string[];
}

const FRAUD_RINGS: FraudRing[] = [
  {
    id: 'ring_1',
    name: 'Auto Body Ring — Downtown',
    severity: 'critical',
    totalAmount: mockClaims.slice(0, 4).reduce((s, c) => s + c.amount, 0),
    claimsInvolved: 4,
    detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: '4 claimants with different policies sharing the same repair shop and collision timeline',
    indicators: ['Same IP address (192.168.1.45)', 'Claims filed 2h apart', 'Identical repair shop', 'Shared phone prefix'],
    nodes: [
      { id: 'n1', type: 'claimant', label: mockClaims[0].claimant.name, riskScore: 92, connections: 3 },
      { id: 'n2', type: 'claimant', label: mockClaims[1].claimant.name, riskScore: 88, connections: 2 },
      { id: 'n3', type: 'claimant', label: mockClaims[2].claimant.name, riskScore: 85, connections: 2 },
      { id: 'n4', type: 'shop', label: 'Quick Fix Auto', riskScore: 94, connections: 4 },
      { id: 'n5', type: 'phone', label: '(555) 234-xxxx', riskScore: 70, connections: 3 },
    ],
    edges: [
      { from: 'n1', to: 'n4', type: 'same_shop', weight: 0.9 },
      { from: 'n2', to: 'n4', type: 'same_shop', weight: 0.9 },
      { from: 'n3', to: 'n4', type: 'same_shop', weight: 0.9 },
      { from: 'n1', to: 'n5', type: 'shared_contact', weight: 0.7 },
      { from: 'n2', to: 'n5', type: 'shared_contact', weight: 0.7 },
    ],
  },
  {
    id: 'ring_2',
    name: 'Staged Accident Network',
    severity: 'high',
    totalAmount: mockClaims.slice(5, 8).reduce((s, c) => s + c.amount, 0),
    claimsInvolved: 3,
    detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Coordinated staged accidents at same intersection — 3 claims, 2 witnesses overlap',
    indicators: ['Same accident location', 'Shared witness names', 'Claims within 30 days', 'Inflated medical bills'],
    nodes: [
      { id: 'm1', type: 'claimant', label: mockClaims[5].claimant.name, riskScore: 79, connections: 2 },
      { id: 'm2', type: 'claimant', label: mockClaims[6].claimant.name, riskScore: 75, connections: 2 },
      { id: 'm3', type: 'address', label: '5th Ave & Main St', riskScore: 82, connections: 3 },
      { id: 'm4', type: 'adjuster', label: 'Dr. Marcus Wong', riskScore: 71, connections: 2 },
    ],
    edges: [
      { from: 'm1', to: 'm3', type: 'same_location', weight: 0.85 },
      { from: 'm2', to: 'm3', type: 'same_location', weight: 0.85 },
      { from: 'm1', to: 'm4', type: 'same_provider', weight: 0.65 },
      { from: 'm2', to: 'm4', type: 'same_provider', weight: 0.65 },
    ],
  },
  {
    id: 'ring_3',
    name: 'Policy Stacking Scheme',
    severity: 'medium',
    totalAmount: mockClaims.slice(15, 17).reduce((s, c) => s + c.amount, 0),
    claimsInvolved: 2,
    detectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Single claimant with overlapping policies from 3 carriers filing simultaneous claims',
    indicators: ['Multiple active policies', 'SSN linked to 3 carriers', 'Timing inconsistencies', 'Address mismatch'],
    nodes: [
      { id: 'p1', type: 'claimant', label: mockClaims[15].claimant.name, riskScore: 68, connections: 3 },
      { id: 'p2', type: 'vehicle', label: '2019 Honda Civic', riskScore: 55, connections: 2 },
      { id: 'p3', type: 'address', label: '123 Oak Street', riskScore: 45, connections: 1 },
    ],
    edges: [
      { from: 'p1', to: 'p2', type: 'same_vehicle', weight: 0.6 },
      { from: 'p1', to: 'p3', type: 'address_flag', weight: 0.5 },
    ],
  },
];

const nodeConfig = {
  claimant: { icon: User, color: '#10B981', bg: 'bg-emerald-500/15', label: 'Claimant' },
  phone: { icon: Phone, color: '#3B82F6', bg: 'bg-blue-500/15', label: 'Phone' },
  address: { icon: MapPin, color: '#8B5CF6', bg: 'bg-purple-500/15', label: 'Address' },
  vehicle: { icon: Shield, color: '#F59E0B', bg: 'bg-amber-500/15', label: 'Vehicle' },
  shop: { icon: CreditCard, color: '#EF4444', bg: 'bg-red-500/15', label: 'Repair Shop' },
  adjuster: { icon: User, color: '#EC4899', bg: 'bg-pink-500/15', label: 'Provider' },
};

const severityConfig = {
  critical: { color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critical' },
  high: { color: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'High Risk' },
  medium: { color: '#3B82F6', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Medium' },
};

export const FraudNetworkGraph = () => {
  const [selected, setSelected] = useState<string | null>('ring_1');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const selectedRing = FRAUD_RINGS.find((r) => r.id === selected);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Network size={18} className="text-[#10B981]" />
        <h3 className="text-base font-bold text-gray-200">Fraud Network Analysis</h3>
        <span className="ml-auto text-[10px] text-gray-600">{FRAUD_RINGS.length} fraud rings detected</span>
      </div>

      {/* Ring selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {FRAUD_RINGS.map((ring) => {
          const cfg = severityConfig[ring.severity];
          return (
            <button
              key={ring.id}
              onClick={() => setSelected(ring.id)}
              className={cn(
                'text-left rounded-xl border p-4 transition-all',
                selected === ring.id ? `${cfg.bg} ${cfg.border}` : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
                <span className="text-[10px] text-gray-600">{ring.claimsInvolved} claims</span>
              </div>
              <p className="text-sm font-bold text-gray-200 mb-1">{ring.name}</p>
              <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{ring.description}</p>
              <p className="text-xs font-bold mt-2" style={{ color: cfg.color }}>{formatCurrency(ring.totalAmount)}</p>
            </button>
          );
        })}
      </div>

      {/* Network visualization */}
      {selectedRing && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Visual graph (simplified SVG) */}
          <GlassPanel className={cn('lg:col-span-3 border', severityConfig[selectedRing.severity].border)}>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Network Graph — {selectedRing.name}</p>

            {/* Simplified network visualization */}
            <div className="relative bg-white/[0.01] rounded-xl border border-white/[0.05] p-4" style={{ minHeight: 280 }}>
              {/* Connection lines (CSS-based) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {selectedRing.edges.map((edge, i) => {
                  const fromIdx = selectedRing.nodes.findIndex((n) => n.id === edge.from);
                  const toIdx = selectedRing.nodes.findIndex((n) => n.id === edge.to);
                  const cols = Math.ceil(Math.sqrt(selectedRing.nodes.length));
                  const fromX = ((fromIdx % cols) + 0.5) * (100 / cols);
                  const fromY = (Math.floor(fromIdx / cols) + 0.5) * (100 / Math.ceil(selectedRing.nodes.length / cols));
                  const toX = ((toIdx % cols) + 0.5) * (100 / cols);
                  const toY = (Math.floor(toIdx / cols) + 0.5) * (100 / Math.ceil(selectedRing.nodes.length / cols));
                  return (
                    <line
                      key={i}
                      x1={`${fromX}%`} y1={`${fromY}%`}
                      x2={`${toX}%`} y2={`${toY}%`}
                      stroke={edge.weight > 0.8 ? '#EF4444' : edge.weight > 0.6 ? '#F59E0B' : '#3B82F6'}
                      strokeWidth={edge.weight * 2}
                      strokeOpacity={0.4}
                      strokeDasharray={edge.type === 'shared_contact' ? '4,4' : '0'}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              <div className={cn(
                'grid gap-4 h-full relative z-10',
                selectedRing.nodes.length <= 3 ? 'grid-cols-3' :
                selectedRing.nodes.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
              )}>
                {selectedRing.nodes.map((node) => {
                  const cfg = nodeConfig[node.type];
                  const NodeIcon = cfg.icon;
                  const isHovered = hoveredNode === node.id;
                  return (
                    <div
                      key={node.id}
                      className={cn(
                        'flex flex-col items-center gap-1.5 cursor-pointer transition-all p-2 rounded-xl',
                        isHovered && 'bg-white/[0.05]'
                      )}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div className={cn('p-3 rounded-xl border transition-all', cfg.bg, isHovered && 'scale-110')}
                        style={{ borderColor: `${cfg.color}33`, boxShadow: isHovered ? `0 0 12px ${cfg.color}40` : 'none' }}>
                        <NodeIcon size={18} style={{ color: cfg.color }} />
                      </div>
                      <p className="text-[9px] text-gray-400 text-center font-medium leading-tight max-w-[80px] truncate">{node.label}</p>
                      <span className="text-[8px] text-gray-600 uppercase">{cfg.label}</span>
                      <div className={cn(
                        'text-[8px] font-bold px-1.5 py-0.5 rounded-full',
                        node.riskScore >= 80 ? 'bg-red-500/20 text-red-400' :
                        node.riskScore >= 60 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      )}>
                        {node.riskScore}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3">
              {[
                { color: '#EF4444', label: 'Strong link', dash: false },
                { color: '#F59E0B', label: 'Medium link', dash: false },
                { color: '#3B82F6', label: 'Indirect link', dash: true },
              ].map((leg) => (
                <div key={leg.label} className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 rounded" style={{ backgroundColor: leg.color, opacity: 0.7, borderTop: leg.dash ? '1px dashed' : 'none' }} />
                  <span className="text-[9px] text-gray-600">{leg.label}</span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Ring details */}
          <div className="lg:col-span-2 space-y-4">
            <GlassPanel>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Ring Details</p>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-gray-600 mb-1">Fraud Indicators</p>
                  <div className="space-y-1.5">
                    {selectedRing.indicators.map((ind, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-white/[0.02] border border-white/[0.05] p-2">
                        <AlertTriangle size={11} className="text-amber-400 shrink-0" />
                        <span className="text-[10px] text-gray-300">{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
                  <div>
                    <p className="text-[10px] text-gray-600">Total Exposure</p>
                    <p className="text-base font-bold text-white tabular-nums">{formatCurrency(selectedRing.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-600">Claims Linked</p>
                    <p className="text-base font-bold text-white">{selectedRing.claimsInvolved}</p>
                  </div>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Network Nodes</p>
              <div className="space-y-2">
                {selectedRing.nodes.map((node) => {
                  const cfg = nodeConfig[node.type];
                  const NodeIcon = cfg.icon;
                  return (
                    <div key={node.id} className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.05] p-2.5">
                      <div className={cn('p-1.5 rounded-lg shrink-0', cfg.bg)}>
                        <NodeIcon size={12} style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-300 truncate">{node.label}</p>
                        <p className="text-[9px] text-gray-600">{node.connections} connections · {cfg.label}</p>
                      </div>
                      <div className={cn(
                        'text-[9px] font-bold px-1.5 py-0.5 rounded-full tabular-nums',
                        node.riskScore >= 80 ? 'bg-red-500/20 text-red-400' :
                        node.riskScore >= 60 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      )}>
                        {node.riskScore}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/[0.06] text-[10px] font-bold text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] transition-colors">
                <Eye size={12} /> View Full Investigation
              </button>
            </GlassPanel>
          </div>
        </div>
      )}
    </div>
  );
};
