import { useState } from 'react';
import { Activity, Wifi, WifiOff, Car, Home, Heart, MapPin, Battery, AlertTriangle, CheckCircle, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/utils/cn';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TABS = ['Telematics', 'Smart Home', 'Wearables', 'Devices'];

const drivingData = Array.from({ length: 14 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  score: 75 + Math.floor(Math.random() * 20),
  miles: Math.floor(Math.random() * 40) + 10,
  speed: 55 + Math.floor(Math.random() * 15),
}));

const trips = [
  { id: 'T001', date: 'Today, 8:42 AM', distance: '12.4 mi', duration: '24 min', score: 94, events: [], route: 'Home → Office' },
  { id: 'T002', date: 'Today, 6:15 PM', distance: '11.8 mi', duration: '31 min', score: 78, events: ['Hard brake detected'], route: 'Office → Home' },
  { id: 'T003', date: 'Yesterday, 9:00 AM', distance: '45.2 mi', duration: '58 min', score: 88, events: [], route: 'Home → Airport' },
  { id: 'T004', date: 'Yesterday, 3:30 PM', distance: '8.1 mi', duration: '22 min', score: 71, events: ['Speeding (78mph in 65)', 'Phone use detected'], route: 'Mall → Home' },
];

const smartHomeDevices = [
  { name: 'Smart Smoke Detector', room: 'Kitchen', status: 'online', battery: 87, lastPing: '2 min ago', alerts: 0, savings: '$18/mo' },
  { name: 'Water Leak Sensor', room: 'Basement', status: 'online', battery: 65, lastPing: '5 min ago', alerts: 0, savings: '$12/mo' },
  { name: 'Smart Door Lock', room: 'Front Door', status: 'online', battery: 92, lastPing: '1 min ago', alerts: 0, savings: '$8/mo' },
  { name: 'Security Camera', room: 'Garage', status: 'offline', battery: 0, lastPing: '3 hrs ago', alerts: 1, savings: '$22/mo' },
  { name: 'Motion Sensor', room: 'Living Room', status: 'online', battery: 78, lastPing: '3 min ago', alerts: 0, savings: '$5/mo' },
  { name: 'Thermostat', room: 'Hallway', status: 'online', battery: 100, lastPing: '1 min ago', alerts: 0, savings: '$10/mo' },
];

const wearableData = [
  { metric: 'Steps Today', value: '8,432', goal: '10,000', pct: 84, icon: Activity, color: 'blue' },
  { metric: 'Heart Rate', value: '72 bpm', goal: '60-100', pct: 100, icon: Heart, color: 'red' },
  { metric: 'Sleep Score', value: '82/100', goal: '85+', pct: 82, icon: Shield, color: 'violet' },
  { metric: 'BMI', value: '23.4', goal: '18.5-24.9', pct: 95, icon: TrendingUp, color: 'emerald' },
];

const connectedDevices = [
  { name: 'OBD Telematics Plug', type: 'Auto', device: 'BlackBox Pro X2', connected: true, lastSync: '2 min ago', dataPoints: '1.2M' },
  { name: 'Nest Protect', type: 'Home', device: 'Nest Protect v3', connected: true, lastSync: '5 min ago', dataPoints: '45K' },
  { name: 'Apple Watch Series 9', type: 'Health', device: 'watchOS 10.2', connected: true, lastSync: '1 min ago', dataPoints: '890K' },
  { name: 'Ring Doorbell', type: 'Home', device: 'Ring Pro 4', connected: false, lastSync: '3 hrs ago', dataPoints: '12K' },
  { name: 'Fitbit Sense 2', type: 'Health', device: 'Fitbit OS 5.3', connected: true, lastSync: '8 min ago', dataPoints: '234K' },
];

export const IoTDashboard = () => {
  const [activeTab, setActiveTab] = useState('Telematics');
  const [drivingScore] = useState(86);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wifi className="text-blue-400" size={28} /> Connected Devices & IoT
          </h1>
          <p className="text-sm text-gray-500 mt-1">Telematics, smart home sensors, and wearables synced to your policies</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/20">
            4 Devices Online
          </span>
          <span className="text-xs text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20">
            1 Offline
          </span>
        </div>
      </div>

      {/* Discount Banner */}
      <div className="p-4 rounded-xl bg-[#10B981]/5 border border-[#10B981]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#10B981]/10">
            <Shield className="text-[#10B981]" size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm">IoT Discount Active</p>
            <p className="text-xs text-gray-400">You're saving <span className="text-[#10B981] font-bold">$75/month</span> by connecting smart devices to your policies</p>
          </div>
        </div>
        <button className="text-xs px-4 py-2 rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors">
          Add More Devices
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10 pb-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px',
              activeTab === tab ? 'border-blue-400 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Telematics */}
      {activeTab === 'Telematics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Driving Score */}
            <GlassPanel className="flex flex-col items-center py-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Driving Score</p>
              <div className="relative">
                <svg width="140" height="140" className="-rotate-90">
                  <circle cx="70" cy="70" r="58" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                  <circle
                    cx="70" cy="70" r="58"
                    stroke={drivingScore >= 80 ? '#10B981' : drivingScore >= 60 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="10" fill="none"
                    strokeDasharray={`${(drivingScore / 100) * 364.4} 364.4`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                  <span className="text-4xl font-bold text-[#10B981]">{drivingScore}</span>
                  <span className="text-xs text-gray-500">/ 100</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold text-[#10B981]">Good Driver</p>
                <p className="text-xs text-gray-500 mt-1">Earning 12% safe driver discount</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 w-full text-center">
                {[
                  { label: 'Miles', value: '487' },
                  { label: 'Trips', value: '34' },
                  { label: 'Events', value: '3' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Driving Stats */}
            <GlassPanel className="md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Score Trend (2 weeks)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={drivingData}>
                    <defs>
                      <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="score" stroke="#10B981" fill="url(#gd)" strokeWidth={2} name="Score" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: 'Hard Braking', value: '2', status: 'good' },
                  { label: 'Speeding Events', value: '1', status: 'good' },
                  { label: 'Phone Use', value: '1', status: 'warning' },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className={cn('text-xl font-bold', s.status === 'good' ? 'text-[#10B981]' : 'text-amber-400')}>{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>

          {/* Recent Trips */}
          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Trips</h3>
            <div className="space-y-3">
              {trips.map(trip => (
                <div key={trip.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn('p-2 rounded-xl', trip.score >= 85 ? 'bg-[#10B981]/10 text-[#10B981]' : trip.score >= 70 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400')}>
                      <Car size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{trip.route}</p>
                      <p className="text-xs text-gray-500">{trip.date} · {trip.distance} · {trip.duration}</p>
                      {trip.events.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {trip.events.map((ev, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 flex items-center gap-1">
                              <AlertTriangle size={9} /> {ev}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-lg font-bold', trip.score >= 85 ? 'text-[#10B981]' : trip.score >= 70 ? 'text-amber-400' : 'text-red-400')}>{trip.score}</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Smart Home */}
      {activeTab === 'Smart Home' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartHomeDevices.map(device => (
              <GlassPanel key={device.name} className={cn(device.status === 'offline' && 'opacity-60')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2.5 rounded-xl', device.status === 'online' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-gray-500/10 text-gray-500')}>
                      <Home size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{device.name}</p>
                      <p className="text-xs text-gray-500">{device.room}</p>
                    </div>
                  </div>
                  {device.alerts > 0 && (
                    <span className="flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">
                      <AlertTriangle size={10} /> {device.alerts} Alert
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Status</span>
                    <span className={cn('font-bold', device.status === 'online' ? 'text-[#10B981]' : 'text-gray-400')}>
                      {device.status === 'online' ? <><CheckCircle size={12} className="inline mr-1" />Online</> : <><WifiOff size={12} className="inline mr-1" />Offline</>}
                    </span>
                  </div>
                  {device.status === 'online' && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-1"><Battery size={11} /> Battery</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-white/5">
                          <div className={cn('h-full rounded-full', device.battery > 50 ? 'bg-[#10B981]' : device.battery > 20 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${device.battery}%` }} />
                        </div>
                        <span>{device.battery}%</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Last ping</span>
                    <span className="text-gray-300">{device.lastPing}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-[#10B981] font-bold">{device.savings}</span>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      )}

      {/* Wearables */}
      {activeTab === 'Wearables' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {wearableData.map(item => (
              <GlassPanel key={item.metric} className="text-center">
                <div className={cn('p-3 rounded-xl w-fit mx-auto mb-3', {
                  'bg-blue-500/10 text-blue-400': item.color === 'blue',
                  'bg-red-500/10 text-red-400': item.color === 'red',
                  'bg-violet-500/10 text-violet-400': item.color === 'violet',
                  'bg-[#10B981]/10 text-[#10B981]': item.color === 'emerald',
                })}>
                  <item.icon size={24} />
                </div>
                <p className="text-xl font-bold">{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.metric}</p>
                <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', {
                      'bg-blue-500': item.color === 'blue',
                      'bg-red-500': item.color === 'red',
                      'bg-violet-500': item.color === 'violet',
                      'bg-[#10B981]': item.color === 'emerald',
                    })}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-600 mt-1">Goal: {item.goal}</p>
              </GlassPanel>
            ))}
          </div>

          <GlassPanel>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Health Discount Impact</h3>
            <div className="p-4 rounded-xl bg-[#10B981]/5 border border-[#10B981]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Healthy Living Discount</p>
                  <p className="text-xs text-gray-400 mt-1">You qualify for health-based premium reduction based on your fitness data</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#10B981]">-8%</p>
                  <p className="text-xs text-gray-500">on Health Premium</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3 text-center">
                {[
                  { label: 'Activity Score', value: '84/100' },
                  { label: 'Heart Health', value: 'Good' },
                  { label: 'Sleep Quality', value: '82/100' },
                  { label: 'BMI Range', value: 'Normal' },
                ].map(s => (
                  <div key={s.label} className="p-2 rounded-lg bg-white/5">
                    <p className="text-sm font-bold text-[#10B981]">{s.value}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Devices */}
      {activeTab === 'Devices' && (
        <div className="space-y-4">
          {connectedDevices.map(device => (
            <GlassPanel key={device.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn('p-3 rounded-xl', device.connected ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-gray-500/10 text-gray-500')}>
                    {device.type === 'Auto' ? <Car size={22} /> : device.type === 'Home' ? <Home size={22} /> : <Heart size={22} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{device.name}</h3>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', device.connected ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-gray-500/10 text-gray-400')}>
                        {device.connected ? 'Connected' : 'Disconnected'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-400">{device.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{device.device} · Last sync: {device.lastSync}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{parseInt(device.dataPoints).toLocaleString()} data points collected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {device.connected ? (
                    <span className="flex items-center gap-1.5 text-xs text-[#10B981]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Live
                    </span>
                  ) : (
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors">
                      Reconnect
                    </button>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={12} />
                    <span>Synced</span>
                  </div>
                </div>
              </div>
            </GlassPanel>
          ))}

          <div className="p-4 rounded-xl border border-dashed border-white/10 flex items-center justify-center">
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
              <Wifi size={18} />
              <span>Connect a New Device</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
