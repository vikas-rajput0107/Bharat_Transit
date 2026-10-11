import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Building2 } from 'lucide-react';
import { STATIONS } from '../data/stations';
import { ROUTES } from '../data/routes';
import { MOCK_BUSES } from '../data/buses';
import { TransitMap } from '../components/maps/TransitMap';
import { Station } from '../types';

export const StopsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSelect = searchParams.get('select');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedStation, setSelectedStation] = useState<Station | null>(
    STATIONS.find((s) => s.id === initialSelect) || STATIONS[0]
  );
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const states = Array.from(new Set(STATIONS.map((s) => s.state))).sort();

  const filteredStations = STATIONS.filter((st) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const match =
        st.name.toLowerCase().includes(q) ||
        st.city.toLowerCase().includes(q) ||
        st.code.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedState !== 'all' && st.state !== selectedState) return false;
    return true;
  });

  const nearbyRoutes = selectedStation
    ? ROUTES.filter(
        (r) =>
          r.originStationId === selectedStation.id ||
          r.destinationStationId === selectedStation.id ||
          r.intermediateStops.some((st) => st.stationId === selectedStation.id)
      )
    : [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 select-none">
      
      {/* Header & Controls */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#4E5F76] mb-1">
              National ISBT Directory
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#F0F4F8] tracking-tight">
              Bus Stations & Intercity Terminals
            </h2>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-[#090C10] border border-[#1B2432] p-0.5 rounded text-xs font-mono">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-[#2563EB] text-white' : 'text-[#8A99AD] hover:text-[#F0F4F8]'
              }`}
            >
              DIRECTORY
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded transition-all cursor-pointer ${
                viewMode === 'map' ? 'bg-[#2563EB] text-white' : 'text-[#8A99AD] hover:text-[#F0F4F8]'
              }`}
            >
              MAP VIEW
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center bg-[#090C10] border border-[#1B2432] rounded px-3 py-2 focus-within:border-[#2563EB]">
            <Search className="w-4 h-4 text-[#4E5F76] mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station name, city or code (e.g. Kashmere Gate, CMBT)..."
              className="w-full bg-transparent text-xs font-mono text-[#F0F4F8] focus:outline-none placeholder-[#4E5F76]"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-[#090C10] border border-[#1B2432] text-xs font-mono text-[#F0F4F8] rounded px-3 py-2 focus:outline-none"
          >
            <option value="all">ALL STATES & TERRITORIES</option>
            {states.map((st) => (
              <option key={st} value={st}>{st.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Layout */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <TransitMap
            buses={MOCK_BUSES}
            routes={ROUTES}
            stations={filteredStations}
            heightClass="h-[550px]"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Station List */}
          <div className="lg:col-span-1 space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
            <h3 className="text-xs font-mono font-semibold text-[#F0F4F8] uppercase tracking-wider">
              TERMINALS ({filteredStations.length})
            </h3>

            {filteredStations.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStation(st)}
                className={`p-3.5 rounded border cursor-pointer transition-all ${
                  selectedStation?.id === st.id
                    ? 'bg-[#182230] border-[#2563EB]'
                    : 'bg-[#0E131B] border-[#1B2432] hover:bg-[#131A24]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#F0F4F8]">{st.name}</div>
                    <div className="text-[11px] text-[#8A99AD] mt-0.5">{st.city}, {st.state}</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#090C10] border border-[#1B2432] text-[#38BDF8]">
                    {st.code}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[#4E5F76]">
                  <span>{st.platforms} BAYS</span>
                  {st.isHub && <span className="text-[#10B981]">MAJOR HUB</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Station Drawer */}
          <div className="lg:col-span-2">
            {selectedStation ? (
              <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-6 space-y-6">
                
                <div className="border-b border-[#1B2432] pb-4">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#38BDF8]">
                    <Building2 className="w-4 h-4" />
                    <span>TERMINAL PROFILE & INFRASTRUCTURE</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F0F4F8] mt-1">{selectedStation.name}</h3>
                  <p className="text-xs font-mono text-[#8A99AD] mt-0.5">{selectedStation.address}</p>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="text-xs font-mono font-semibold text-[#4E5F76] uppercase tracking-wider mb-2">
                    Terminal Facilities & Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStation.amenities.map((am, i) => (
                      <span key={i} className="text-xs font-mono px-2.5 py-1 rounded bg-[#090C10] border border-[#1B2432] text-[#F0F4F8]">
                        ✓ {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nearby Routes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">
                    Scheduled Express Corridors ({nearbyRoutes.length})
                  </h4>
                  <div className="space-y-2">
                    {nearbyRoutes.map((rt) => (
                      <div key={rt.id} className="p-3 bg-[#090C10] border border-[#1B2432] rounded flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-[#F0F4F8]">{rt.name}</div>
                          <div className="text-[11px] font-mono text-[#4E5F76]">Route #{rt.routeNumber} • {rt.totalDistanceKm} KM</div>
                        </div>
                        <span className="text-[#38BDF8] font-mono text-[11px]">{rt.frequencyText}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-12 text-center text-xs text-[#8A99AD]">
                Select a station from the directory to inspect platform bays and amenities.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
