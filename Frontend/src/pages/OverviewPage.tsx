import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRightLeft, Bus, Navigation, Route, AlertTriangle, ArrowRight, Activity, Clock } from 'lucide-react';
import { useTransitStore } from '../store/useTransitStore';
import { TransitMap } from '../components/maps/TransitMap';
import { ROUTES } from '../data/routes';
import { STATIONS } from '../data/stations';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { buses, alerts, getMetrics } = useTransitStore();
  
  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState('Jaipur');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);

  const metrics = getMetrics();
  const activeAlerts = alerts.filter((a) => !a.isResolved && !a.archived).slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/buses?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&date=${travelDate}`);
  };

  const handleSwapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200 select-none">
      
      {/* Editorial Header & Search Console */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-6 space-y-6">
        
        {/* Scope Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1B2432] pb-5 gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#4E5F76] mb-1">
              National Dispatch Telemetry
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#F0F4F8] tracking-tight">
              India Intercity Operations
            </h2>
            <p className="text-xs text-[#8A99AD] mt-1 max-w-xl">
              Real-time monitoring, route planning, and live fleet status across major Indian transit corridors.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-[#8A99AD] bg-[#090C10] px-3.5 py-2 rounded border border-[#1B2432] self-start md:self-auto">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>ACTIVE UNITS: <strong className="text-[#F0F4F8] font-numeric">{metrics.activeBuses}</strong></span>
            </span>
            <span className="text-[#1B2432]">|</span>
            <span>ACCURACY: <strong className="text-[#38BDF8] font-numeric">99.4%</strong></span>
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          
          {/* From City */}
          <div>
            <label className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider block mb-1.5">
              01. Origin Station
            </label>
            <div className="flex items-center bg-[#090C10] border border-[#1B2432] rounded px-3 py-2.5 focus-within:border-[#2563EB] transition-colors">
              <MapPin className="w-4 h-4 text-[#2563EB] mr-2.5 flex-shrink-0" />
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="e.g. Delhi"
                className="w-full bg-transparent text-xs font-medium text-[#F0F4F8] focus:outline-none placeholder-[#4E5F76]"
              />
            </div>
          </div>

          {/* Swap Button & To City */}
          <div className="relative flex items-end">
            <button
              type="button"
              onClick={handleSwapCities}
              className="absolute -top-3 sm:top-6 -left-3 sm:-left-3.5 z-10 p-1.5 bg-[#131A24] hover:bg-[#182230] border border-[#1B2432] text-[#38BDF8] rounded transition-transform hover:rotate-180 cursor-pointer"
              title="Swap origin and destination"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>

            <div className="w-full">
              <label className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider block mb-1.5">
                02. Destination Terminal
              </label>
              <div className="flex items-center bg-[#090C10] border border-[#1B2432] rounded px-3 py-2.5 focus-within:border-[#2563EB] transition-colors">
                <MapPin className="w-4 h-4 text-[#38BDF8] mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="e.g. Jaipur"
                  className="w-full bg-transparent text-xs font-medium text-[#F0F4F8] focus:outline-none placeholder-[#4E5F76]"
                />
              </div>
            </div>
          </div>

          {/* Departure Date */}
          <div>
            <label className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider block mb-1.5">
              03. Departure Date
            </label>
            <div className="flex items-center bg-[#090C10] border border-[#1B2432] rounded px-3 py-2.5 focus-within:border-[#2563EB] transition-colors">
              <Calendar className="w-4 h-4 text-[#8A99AD] mr-2.5 flex-shrink-0" />
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-[#F0F4F8] focus:outline-none"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold text-xs px-4 py-2.5 rounded transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH BUSES</span>
            </button>
          </div>

        </form>

      </div>

      {/* High Density Metric Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'SAMPLE FLEET', value: metrics.totalBuses, sub: 'Configured vehicles', icon: Bus, accent: 'border-l-[#2563EB]' },
          { label: 'TELEMETRY ACTIVE', value: metrics.activeBuses, sub: 'Currently moving', icon: Navigation, accent: 'border-l-[#10B981]' },
          { label: 'NATIONAL CORRIDORS', value: metrics.totalRoutes, sub: 'Active highway routes', icon: Route, accent: 'border-l-[#38BDF8]' },
          { label: 'SERVICE DISRUPTIONS', value: metrics.activeAlerts, sub: 'Current advisories', icon: AlertTriangle, accent: metrics.activeAlerts > 0 ? 'border-l-[#F59E0B]' : 'border-l-[#10B981]' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-[#0E131B] border border-[#1B2432] ${stat.accent} border-l-4 p-4 rounded`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#4E5F76]">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-[#8A99AD]" />
            </div>
            <div className="text-2xl font-bold text-[#F0F4F8] font-numeric mt-1.5">{stat.value}</div>
            <div className="text-[11px] text-[#4E5F76] mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Interactive Map Preview */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1B2432] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#F0F4F8] flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#2563EB]" />
              <span>National Telemetry Map</span>
            </h3>
            <p className="text-xs text-[#8A99AD] mt-0.5">Live positioning across primary Indian intercity corridors</p>
          </div>
          <button
            onClick={() => navigate('/live')}
            className="text-xs font-mono text-[#2563EB] hover:text-[#38BDF8] flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <span>FULLSCREEN TRACKING</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <TransitMap
          buses={buses}
          routes={ROUTES}
          stations={STATIONS}
          heightClass="h-[440px]"
        />
      </div>

      {/* Split Grid: Corridors & Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* High Frequency Corridors */}
        <div className="lg:col-span-2 bg-[#0E131B] border border-[#1B2432] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1B2432] pb-3">
            <div>
              <h3 className="text-sm font-semibold text-[#F0F4F8]">Intercity High Frequency Corridors</h3>
              <p className="text-xs text-[#8A99AD] mt-0.5">Major interstate highway transit lines</p>
            </div>
            <button
              onClick={() => navigate('/plan')}
              className="text-xs font-mono text-[#38BDF8] hover:underline cursor-pointer"
            >
              JOURNEY PLANNER →
            </button>
          </div>

          <div className="space-y-2">
            {ROUTES.slice(0, 4).map((rt) => (
              <div
                key={rt.id}
                onClick={() => navigate(`/live?route=${rt.id}`)}
                className="p-3 bg-[#131A24] border border-[#1B2432] hover:border-[#2A384C] rounded flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-[#090C10] border border-[#1B2432] flex items-center justify-center">
                    <Route className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#F0F4F8] group-hover:text-[#38BDF8] transition-colors">
                      {rt.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#4E5F76]">
                      {rt.totalDistanceKm} KM • {rt.frequencyText}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded border border-[#10B981]/20">
                    Est. {Math.floor(rt.estimatedDurationMins / 60)}h {rt.estimatedDurationMins % 60}m
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#4E5F76] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Service Advisories */}
        <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1B2432] pb-3">
            <h3 className="text-sm font-semibold text-[#F0F4F8]">Service Advisories</h3>
            <button onClick={() => navigate('/alerts')} className="text-xs font-mono text-[#2563EB] hover:underline cursor-pointer">
              VIEW ALL
            </button>
          </div>

          <div className="space-y-2.5">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#8A99AD]">No active advisories</div>
            ) : (
              activeAlerts.map((alt) => (
                <div key={alt.id} className="p-3 bg-[#131A24] border border-[#1B2432] rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                      {alt.category.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-[#4E5F76]">{alt.timestampText}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#F0F4F8]">{alt.title}</div>
                  <div className="text-[11px] text-[#8A99AD] line-clamp-2">{alt.description}</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
