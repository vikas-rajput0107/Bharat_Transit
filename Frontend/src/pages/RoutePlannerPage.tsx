import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Bookmark, RefreshCw, Layers } from 'lucide-react';
import { findJourneys } from '../services/transitService';
import { useTransitStore } from '../store/useTransitStore';
import { CITIES } from '../data/stations';
import { Journey } from '../types';

export const RoutePlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { toggleSaveItem, isSaved } = useTransitStore();

  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState('Varanasi');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string | null>(null);

  const journeys = findJourneys(fromCity, toCity);
  const selectedJourney = journeys.find((j) => j.id === selectedJourneyId) || journeys[0];

  const handleSaveJourney = (j: Journey) => {
    toggleSaveItem({
      type: 'journey',
      targetId: j.id,
      title: `${j.originCity} to ${j.destinationCity} Itinerary`,
      subtitle: `${j.transferCount === 0 ? 'Direct Service' : `${j.transferCount} Transfer`} • ₹${j.totalFareINR} • ${Math.floor(j.totalDurationMins / 60)}h ${j.totalDurationMins % 60}m`,
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 select-none">
      
      {/* Header Console */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-5 space-y-5">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#4E5F76] mb-1">
            Graph Route Engine
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#F0F4F8] tracking-tight">
            Intercity Journey & Transfer Planner
          </h2>
        </div>

        {/* Origin / Destination Input Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider block mb-1.5">
              01. Origin Hub
            </label>
            <div className="flex items-center bg-[#090C10] border border-[#1B2432] rounded px-3 py-2.5 focus-within:border-[#2563EB]">
              <MapPin className="w-4 h-4 text-[#2563EB] mr-2.5 flex-shrink-0" />
              <input
                type="text"
                list="planner-cities"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="Origin city..."
                className="w-full bg-transparent text-xs font-medium text-[#F0F4F8] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider block mb-1.5">
              02. Destination Hub
            </label>
            <div className="flex items-center bg-[#090C10] border border-[#1B2432] rounded px-3 py-2.5 focus-within:border-[#2563EB]">
              <MapPin className="w-4 h-4 text-[#38BDF8] mr-2.5 flex-shrink-0" />
              <input
                type="text"
                list="planner-cities"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="Destination city..."
                className="w-full bg-transparent text-xs font-medium text-[#F0F4F8] focus:outline-none"
              />
            </div>
          </div>

          <datalist id="planner-cities">
            {CITIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFromCity('Delhi');
                setToCity('Jaipur');
              }}
              className="px-3.5 py-2 bg-[#131A24] border border-[#1B2432] hover:bg-[#182230] text-xs font-mono text-[#8A99AD] rounded transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESET TO DELHI → JAIPUR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Itineraries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Journey Options List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-mono font-semibold text-[#F0F4F8] uppercase tracking-wider">
            COMPUTED ITINERARIES ({journeys.length})
          </h3>

          {journeys.length === 0 ? (
            <div className="bg-[#0E131B] border border-[#1B2432] p-6 rounded text-center text-xs text-[#8A99AD]">
              No direct or 1-transfer routes found between {fromCity} and {toCity}.
            </div>
          ) : (
            journeys.map((j) => {
              const isSelected = selectedJourney?.id === j.id;
              const saved = isSaved('journey', j.id);

              return (
                <div
                  key={j.id}
                  onClick={() => setSelectedJourneyId(j.id)}
                  className={`p-4 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#182230] border-[#2563EB]'
                      : 'bg-[#0E131B] border-[#1B2432] hover:bg-[#131A24]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      j.transferCount === 0
                        ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                        : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20'
                    }`}>
                      {j.transferCount === 0 ? 'DIRECT' : `${j.transferCount} TRANSFER`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveJourney(j);
                      }}
                      className={`p-1 rounded text-xs cursor-pointer ${saved ? 'text-[#38BDF8]' : 'text-[#4E5F76] hover:text-[#F0F4F8]'}`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 font-mono">
                    <div>
                      <div className="text-base font-bold text-[#F0F4F8]">{j.departureTime}</div>
                      <div className="text-xs text-[#8A99AD]">{j.originCity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-[#4E5F76]">
                        {Math.floor(j.totalDurationMins / 60)}h {j.totalDurationMins % 60}m
                      </div>
                      <div className="w-16 h-0.5 bg-[#2563EB] my-1 mx-auto" />
                      <div className="text-[10px] text-[#4E5F76]">{j.totalDistanceKm} KM</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-[#F0F4F8]">{j.arrivalTime}</div>
                      <div className="text-xs text-[#8A99AD]">{j.destinationCity}</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#1B2432] flex items-center justify-between text-xs font-mono text-[#8A99AD]">
                    <span>Fare: <strong className="text-[#F0F4F8]">₹{j.totalFareINR}</strong></span>
                    <span className="text-[#2563EB] flex items-center space-x-1">
                      <span>TIMELINE</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Journey Timeline */}
        <div className="lg:col-span-2">
          {selectedJourney ? (
            <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#1B2432] pb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#F0F4F8]">
                    {selectedJourney.originCity} → {selectedJourney.destinationCity} Breakdown
                  </h3>
                  <p className="text-xs font-mono text-[#8A99AD] mt-0.5">
                    {selectedJourney.legs.length} Leg(s) • Total Distance: {selectedJourney.totalDistanceKm} KM
                  </p>
                </div>

                <button
                  onClick={() => handleSaveJourney(selectedJourney)}
                  className="px-3 py-1.5 bg-[#2563EB]/10 text-[#38BDF8] border border-[#2563EB]/30 rounded text-xs font-mono font-medium hover:bg-[#2563EB]/20 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved('journey', selectedJourney.id) ? 'SAVED' : 'SAVE ITINERARY'}</span>
                </button>
              </div>

              {/* Timeline Display */}
              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1B2432]">
                {selectedJourney.legs.map((leg, index) => (
                  <div key={leg.id} className="relative pl-10">
                    <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#2563EB] ring-4 ring-[#0E131B]" />
                    
                    <div className="bg-[#090C10] border border-[#1B2432] rounded p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-[#38BDF8]">
                            LEG {index + 1}: {leg.operatorName}
                          </span>
                          <span className="text-[10px] font-mono bg-[#0E131B] border border-[#1B2432] text-[#8A99AD] px-2 py-0.5 rounded">
                            {leg.serviceCategory}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-[#F0F4F8] font-mono">₹{leg.fareINR}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-[#4E5F76] font-mono text-[10px] uppercase">Boarding Station</div>
                          <div className="font-semibold text-[#F0F4F8]">{leg.fromStationName}</div>
                          <div className="text-[11px] font-mono text-[#38BDF8]">Dep: {leg.departureTime}</div>
                        </div>
                        <div>
                          <div className="text-[#4E5F76] font-mono text-[10px] uppercase">Dropoff Station</div>
                          <div className="font-semibold text-[#F0F4F8]">{leg.toStationName}</div>
                          <div className="text-[11px] font-mono text-[#10B981]">Arr: {leg.arrivalTime}</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#1B2432] flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#4E5F76]">ROUTE #{leg.routeNumber}</span>
                        <button
                          onClick={() => navigate(`/bus/${leg.busId}`)}
                          className="text-[#2563EB] hover:underline cursor-pointer"
                        >
                          TRACK BUS #{leg.busId} →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-12 text-center text-xs text-[#8A99AD]">
              Select an itinerary option to view step-by-step transfer instructions.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
