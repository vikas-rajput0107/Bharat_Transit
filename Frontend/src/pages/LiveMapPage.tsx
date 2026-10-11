import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, ArrowRight, Radio } from 'lucide-react';
import { useTransitStore } from '../store/useTransitStore';
import { TransitMap } from '../components/maps/TransitMap';
import { SimulationControls } from '../components/buses/SimulationControls';
import { ROUTES } from '../data/routes';
import { STATIONS } from '../data/stations';
import { OPERATORS } from '../data/operators';
import { BusStatus } from '../types';

export const LiveMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeParam = searchParams.get('route');

  const { buses, selectedBusId, setSelectedBusId } = useTransitStore();

  const [panelOpen, setPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<BusStatus | 'all'>('all');
  const [acFilter, setAcFilter] = useState<'all' | 'ac' | 'non-ac'>('all');

  const filteredBuses = buses.filter((bus) => {
    if (routeParam && bus.routeId !== routeParam) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const match =
        bus.registrationNumber.toLowerCase().includes(q) ||
        bus.operatorName.toLowerCase().includes(q) ||
        bus.routeName.toLowerCase().includes(q) ||
        bus.destinationName.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedOperator !== 'all' && bus.operatorId !== selectedOperator) return false;
    if (selectedStatus !== 'all' && bus.status !== selectedStatus) return false;
    if (acFilter === 'ac' && !bus.isAC) return false;
    if (acFilter === 'non-ac' && bus.isAC) return false;

    return true;
  });

  const selectedBus = buses.find((b) => b.id === selectedBusId);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#090C10] select-none">
      
      {/* Simulation Engine Controls Bar */}
      <div className="p-3 bg-[#0E131B] border-b border-[#1B2432] flex-shrink-0">
        <SimulationControls />
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* Left Telemetry List Panel */}
        <div className={`transition-all duration-300 z-20 flex flex-col bg-[#0E131B] border-r border-[#1B2432] ${
          panelOpen ? 'w-80 md:w-96' : 'w-0 border-none'
        } overflow-hidden`}>
          
          {/* Header & Filters */}
          <div className="p-3 border-b border-[#1B2432] space-y-2.5 bg-[#090C10]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#F0F4F8] uppercase tracking-wider flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>UNITS ({filteredBuses.length})</span>
              </span>
              {routeParam && (
                <button
                  onClick={() => navigate('/live')}
                  className="text-[11px] font-mono text-[#38BDF8] hover:underline"
                >
                  CLEAR ROUTE
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="flex items-center bg-[#0E131B] border border-[#1B2432] rounded px-2.5 py-1.5 focus-within:border-[#2563EB]">
              <Search className="w-3.5 h-3.5 text-[#4E5F76] mr-2" />
              <input
                type="text"
                placeholder="Registration or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-[#F0F4F8] focus:outline-none placeholder-[#4E5F76]"
              />
            </div>

            {/* Filter Selectors */}
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="bg-[#0E131B] border border-[#1B2432] text-[#8A99AD] rounded px-1.5 py-1 focus:outline-none"
              >
                <option value="all">ALL OPS</option>
                {OPERATORS.map((o) => (
                  <option key={o.id} value={o.id}>{o.code}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="bg-[#0E131B] border border-[#1B2432] text-[#8A99AD] rounded px-1.5 py-1 focus:outline-none"
              >
                <option value="all">ALL STATUS</option>
                <option value="moving">MOVING</option>
                <option value="delayed">DELAYED</option>
                <option value="stopped">HALTED</option>
              </select>

              <select
                value={acFilter}
                onChange={(e) => setAcFilter(e.target.value as any)}
                className="bg-[#0E131B] border border-[#1B2432] text-[#8A99AD] rounded px-1.5 py-1 focus:outline-none"
              >
                <option value="all">ALL TYPES</option>
                <option value="ac">AC ONLY</option>
                <option value="non-ac">NON-AC</option>
              </select>
            </div>
          </div>

          {/* List Scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#1B2432] p-2 space-y-1">
            {filteredBuses.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[#4E5F76]">
                NO ACTIVE UNITS MATCH FILTERS
              </div>
            ) : (
              filteredBuses.map((bus) => (
                <div
                  key={bus.id}
                  onClick={() => setSelectedBusId(bus.id)}
                  className={`p-3 rounded cursor-pointer transition-all ${
                    bus.id === selectedBusId
                      ? 'bg-[#182230] border border-[#2563EB]'
                      : 'hover:bg-[#131A24] border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F0F4F8] font-mono">
                      {bus.registrationNumber}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                      bus.status === 'moving' ? 'bg-[#10B981]/10 text-[#10B981]' :
                      bus.status === 'delayed' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      'bg-[#F43F5E]/10 text-[#F43F5E]'
                    }`}>
                      {bus.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs text-[#8A99AD] mt-1 font-medium truncate">
                    {bus.routeName}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#4E5F76] mt-2">
                    <span>{bus.speedKmH} KM/H</span>
                    <span>NEXT: {bus.nextStopName}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Card Footer */}
          {selectedBus && (
            <div className="p-3 bg-[#090C10] border-t border-[#1B2432] space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-[#F0F4F8]">
                  {selectedBus.registrationNumber}
                </span>
                <span className="text-[10px] text-[#38BDF8]">{selectedBus.operatorName}</span>
              </div>
              <div className="text-[11px] font-mono text-[#8A99AD]">
                PROGRESS: {selectedBus.routeProgressPercent}% CORRIDOR
              </div>
              <button
                onClick={() => navigate(`/bus/${selectedBus.id}`)}
                className="w-full py-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-mono font-medium rounded transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>VEHICLE TELEMETRY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Panel Toggle Button */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="absolute top-4 left-4 z-30 p-2 bg-[#0E131B] border border-[#1B2432] hover:bg-[#131A24] text-[#F0F4F8] rounded shadow-xl cursor-pointer"
          title={panelOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {panelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Leaflet Map */}
        <div className="flex-1 h-full relative">
          <TransitMap
            buses={filteredBuses}
            routes={ROUTES}
            stations={STATIONS}
            selectedBusId={selectedBusId}
            onSelectBus={(b) => setSelectedBusId(b.id)}
            heightClass="h-full"
          />
        </div>

      </div>

    </div>
  );
};
