import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bus as BusIcon, MapPin, Route as RouteIcon, AlertTriangle, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useTransitStore } from '../../store/useTransitStore';
import { MOCK_BUSES } from '../../data/buses';
import { STATIONS } from '../../data/stations';
import { ROUTES } from '../../data/routes';
import { OPERATORS } from '../../data/operators';

export const CommandMenu: React.FC = () => {
  const navigate = useNavigate();
  const { isCommandMenuOpen, setCommandMenuOpen } = useTransitStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandMenuOpen(!isCommandMenuOpen);
      }
      // Toggle on '/' when not in an input/textarea
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setCommandMenuOpen(true);
      }
      // Close on Escape
      if (e.key === 'Escape' && isCommandMenuOpen) {
        setCommandMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandMenuOpen, setCommandMenuOpen]);

  if (!isCommandMenuOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedBuses = MOCK_BUSES.filter(
    (b) =>
      b.registrationNumber.toLowerCase().includes(q) ||
      b.operatorName.toLowerCase().includes(q) ||
      b.routeName.toLowerCase().includes(q)
  ).slice(0, 4);

  const matchedStations = STATIONS.filter(
    (s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
  ).slice(0, 4);

  const matchedRoutes = ROUTES.filter(
    (r) => r.name.toLowerCase().includes(q) || r.routeNumber.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedOperators = OPERATORS.filter(
    (o) => o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)
  ).slice(0, 3);

  const handleSelect = (url: string) => {
    setCommandMenuOpen(false);
    setQuery('');
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-2xl bg-[#0E131B] border border-[#1B2432] rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1B2432] bg-[#090C10]">
          <Search className="w-5 h-5 text-[#4E5F76] mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search bus registration, station, city, operator or route..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#F0F4F8] placeholder-[#4E5F76] focus:outline-none text-sm font-mono"
          />
          <button
            onClick={() => setCommandMenuOpen(false)}
            className="p-1 text-[#4E5F76] hover:text-[#F0F4F8] transition-colors rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          
          {/* Quick Navigation */}
          {query === '' && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {[
                  { title: 'Live Tracking Map', path: '/live', icon: RouteIcon },
                  { title: 'Find Buses', path: '/buses', icon: BusIcon },
                  { title: 'Journey Planner', path: '/plan', icon: MapPin },
                  { title: 'Service Alerts', path: '/alerts', icon: AlertTriangle },
                  { title: 'Station Directory', path: '/stops', icon: MapPin },
                  { title: 'Network Insights', path: '/insights', icon: ShieldCheck },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    className="flex items-center justify-between p-2.5 rounded bg-[#090C10] border border-[#1B2432] hover:border-[#2563EB]/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <item.icon className="w-4 h-4 text-[#2563EB]" />
                      <span className="text-xs font-medium text-[#F0F4F8]">{item.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#4E5F76] group-hover:text-[#38BDF8] group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buses */}
          {matchedBuses.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">
                Active Vehicles ({matchedBuses.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchedBuses.map((bus) => (
                  <button
                    key={bus.id}
                    onClick={() => handleSelect(`/bus/${bus.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded hover:bg-[#131A24] transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded bg-[#090C10] border border-[#1B2432] flex items-center justify-center">
                        <BusIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#F0F4F8] font-mono">
                          {bus.registrationNumber} • <span className="text-[#8A99AD]">{bus.operatorName}</span>
                        </div>
                        <div className="text-[11px] text-[#8A99AD]">{bus.routeName}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#2563EB]/10 text-[#38BDF8]">
                      {bus.status.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stations */}
          {matchedStations.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">
                Stations & Terminals ({matchedStations.length})
              </div>
              <div className="space-y-1 mt-1">
                {matchedStations.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleSelect(`/stops?select=${st.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded hover:bg-[#131A24] transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded bg-[#090C10] border border-[#1B2432] flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#F0F4F8]">{st.name}</div>
                        <div className="text-[11px] text-[#8A99AD] font-mono">{st.city}, {st.state} • {st.code}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#4E5F76]">{st.platforms} BAYS</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Routes */}
          {matchedRoutes.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">
                Highways & Routes
              </div>
              <div className="space-y-1 mt-1">
                {matchedRoutes.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => handleSelect(`/live?route=${rt.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded hover:bg-[#131A24] transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded bg-[#090C10] border border-[#1B2432] flex items-center justify-center">
                        <RouteIcon className="w-3.5 h-3.5 text-[#10B981]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#F0F4F8]">{rt.name}</div>
                        <div className="text-[11px] font-mono text-[#8A99AD]">Route #{rt.routeNumber} • {rt.totalDistanceKm} KM</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#4E5F76]">{rt.frequencyText}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query !== '' && matchedBuses.length === 0 && matchedStations.length === 0 && matchedRoutes.length === 0 && matchedOperators.length === 0 && (
            <div className="py-10 text-center text-[#8A99AD]">
              <Search className="w-6 h-6 mx-auto mb-2 text-[#4E5F76]" />
              <p className="text-xs font-mono font-medium text-[#F0F4F8]">No matching items for "{query}"</p>
              <p className="text-[11px] font-mono mt-1 text-[#4E5F76]">Search for 'Delhi', 'Jaipur', 'RSRTC', or 'Shivneri'</p>
            </div>
          )}

        </div>

        {/* Command Footer */}
        <div className="px-4 py-2.5 bg-[#090C10] border-t border-[#1B2432] flex items-center justify-between text-[11px] font-mono text-[#4E5F76]">
          <div className="flex items-center space-x-3">
            <span><kbd className="px-1.5 py-0.5 bg-[#0E131B] border border-[#1B2432] rounded text-[#F0F4F8]">↑↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-[#0E131B] border border-[#1B2432] rounded text-[#F0F4F8]">↵</kbd> select</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 bg-[#0E131B] border border-[#1B2432] rounded text-[#F0F4F8]">esc</kbd> close</span>
        </div>

      </div>
    </div>
  );
};
