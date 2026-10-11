import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTransitStore } from '../store/useTransitStore';

export const InsightsPage: React.FC = () => {
  const { getMetrics } = useTransitStore();
  const metrics = getMetrics();

  const operatorData = [
    { name: 'MSRTC', count: 15800 },
    { name: 'UPSRTC', count: 11200 },
    { name: 'TSRTC', count: 9200 },
    { name: 'GSRTC', count: 8700 },
    { name: 'KSRTC', count: 8300 },
    { name: 'RSRTC', count: 4500 },
  ];

  const regionDistribution = [
    { name: 'North India', value: 38, color: '#2563EB' },
    { name: 'West India', value: 27, color: '#38BDF8' },
    { name: 'South India', value: 23, color: '#10B981' },
    { name: 'East India', value: 12, color: '#F59E0B' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 select-none">
      
      {/* Header */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#4E5F76] mb-1">
            Executive Analytics Telemetry
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#F0F4F8] tracking-tight">
            National Network Insights & Performance
          </h2>
          <p className="text-xs text-[#8A99AD] mt-0.5">
            Illustrative performance telemetry computed across Indian State Road Transport Corporations.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-[#090C10] border border-[#1B2432] text-[#10B981] rounded self-start sm:self-auto">
          DEMO TELEMETRY FEED
        </span>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0E131B] border border-[#1B2432] p-4 rounded">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#4E5F76]">ON-TIME RELIABILITY</div>
          <div className="text-2xl font-bold text-[#10B981] font-mono mt-1">{metrics.onTimePercentage}%</div>
          <div className="text-[10px] font-mono text-[#4E5F76] mt-0.5">Within 5 min variance</div>
        </div>

        <div className="bg-[#0E131B] border border-[#1B2432] p-4 rounded">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#4E5F76]">AVG NETWORK DELAY</div>
          <div className="text-2xl font-bold text-[#F59E0B] font-mono mt-1">{metrics.averageDelayMins} MINS</div>
          <div className="text-[10px] font-mono text-[#4E5F76] mt-0.5">Across delayed units</div>
        </div>

        <div className="bg-[#0E131B] border border-[#1B2432] p-4 rounded">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#4E5F76]">TRACKED FLEET</div>
          <div className="text-2xl font-bold text-[#F0F4F8] font-mono mt-1">{metrics.totalBuses} UNITS</div>
          <div className="text-[10px] font-mono text-[#4E5F76] mt-0.5">{metrics.activeBuses} active on road</div>
        </div>

        <div className="bg-[#0E131B] border border-[#1B2432] p-4 rounded">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#4E5F76]">DAILY PASSENGERS</div>
          <div className="text-2xl font-bold text-[#38BDF8] font-mono mt-1">48,920</div>
          <div className="text-[10px] font-mono text-[#4E5F76] mt-0.5">Estimated throughput</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* State Fleet Size Bar Chart */}
        <div className="bg-[#0E131B] border border-[#1B2432] p-5 rounded-lg space-y-4">
          <h3 className="text-xs font-mono font-semibold text-[#F0F4F8] uppercase tracking-wider">State Transport Corporation Fleet Size</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={operatorData}>
                <XAxis dataKey="name" stroke="#4E5F76" fontSize={10} tickLine={false} />
                <YAxis stroke="#4E5F76" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090C10', borderColor: '#1B2432', color: '#F0F4F8', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution Pie Chart */}
        <div className="bg-[#0E131B] border border-[#1B2432] p-5 rounded-lg space-y-4">
          <h3 className="text-xs font-mono font-semibold text-[#F0F4F8] uppercase tracking-wider">Regional Service Share</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.name} (${entry.value}%)`}
                >
                  {regionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090C10', borderColor: '#1B2432', color: '#F0F4F8', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
