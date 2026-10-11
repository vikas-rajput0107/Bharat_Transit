import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus as BusIcon, Bookmark, BookmarkCheck, Navigation, ArrowRight } from 'lucide-react';
import { Bus } from '../../types';
import { useTransitStore } from '../../store/useTransitStore';

interface BusCardProps {
  bus: Bus;
  onTrackOnMap?: (bus: Bus) => void;
}

export const BusCard: React.FC<BusCardProps> = ({ bus, onTrackOnMap }) => {
  const navigate = useNavigate();
  const { isSaved, toggleSaveItem } = useTransitStore();
  const saved = isSaved('bus', bus.id);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveItem({
      type: 'bus',
      targetId: bus.id,
      title: `${bus.operatorName} (${bus.registrationNumber})`,
      subtitle: bus.routeName,
    });
  };

  return (
    <div className="bg-[#0E131B] border border-[#1B2432] hover:border-[#2A384C] rounded p-4 transition-all duration-150 group flex flex-col justify-between space-y-4 shadow-sm">
      
      {/* Top Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded bg-[#090C10] border border-[#1B2432] group-hover:border-[#2563EB]/50 flex items-center justify-center flex-shrink-0 transition-colors">
            <BusIcon className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-[#F0F4F8] font-mono tracking-wide">
                {bus.registrationNumber}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#090C10] border border-[#1B2432] text-[#8A99AD]">
                {bus.serviceCategory}
              </span>
              {bus.isAC && (
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#2563EB]/10 text-[#38BDF8] border border-[#2563EB]/30">
                  AC
                </span>
              )}
            </div>
            <div className="text-xs text-[#8A99AD] mt-0.5 font-medium">
              {bus.operatorName}
            </div>
            {bus.driver && (
              <div className="text-[11px] text-[#38BDF8] font-mono mt-0.5">
                Pilot: <span className="text-[#F0F4F8] font-medium">{bus.driver.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Bookmark */}
        <button
          onClick={handleSaveToggle}
          className={`p-1.5 rounded border transition-colors cursor-pointer ${
            saved
              ? 'bg-[#2563EB]/10 text-[#38BDF8] border-[#2563EB]/40'
              : 'bg-[#090C10] text-[#4E5F76] border-[#1B2432] hover:text-[#F0F4F8]'
          }`}
          title={saved ? 'Remove bookmark' : 'Bookmark vehicle'}
        >
          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Middle Telemetry Schedule & Progress Row */}
      <div className="bg-[#090C10] border border-[#1B2432] rounded p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        
        {/* Origin */}
        <div>
          <div className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">Departure</div>
          <div className="text-sm font-bold text-[#F0F4F8] font-mono mt-0.5">{bus.departureTime}</div>
          <div className="text-xs text-[#8A99AD] truncate">{bus.originName}</div>
        </div>

        {/* Progress / Speed / Delay */}
        <div className="text-center px-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8A99AD] mb-1">
            <span>{bus.speedKmH} KM/H</span>
            <span className={`font-semibold ${
              bus.status === 'moving' ? 'text-[#10B981]' :
              bus.status === 'delayed' ? 'text-[#F59E0B]' : 'text-[#F43F5E]'
            }`}>
              {bus.delayMinutes > 0 ? `+${bus.delayMinutes} MIN DELAY` : bus.status.toUpperCase()}
            </span>
          </div>
          <div className="w-full h-1 bg-[#131A24] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                bus.status === 'moving' ? 'bg-[#10B981]' :
                bus.status === 'delayed' ? 'bg-[#F59E0B]' : 'bg-[#F43F5E]'
              }`}
              style={{ width: `${bus.routeProgressPercent}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#4E5F76] mt-1 truncate">Next: {bus.nextStopName}</div>
        </div>

        {/* Destination */}
        <div className="sm:text-right">
          <div className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">Arrival (Est)</div>
          <div className="text-sm font-bold text-[#F0F4F8] font-mono mt-0.5">{bus.estimatedArrivalTime}</div>
          <div className="text-xs text-[#8A99AD] truncate">{bus.destinationName}</div>
        </div>

      </div>

      {/* Bottom Actions & Fare */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-xs text-[#8A99AD]">Fare: </span>
          <span className="text-sm font-bold text-[#F0F4F8] font-mono">₹{bus.fareINR}</span>
          <span className="text-[10px] font-mono text-[#10B981] ml-2">({bus.availableSeats} seats left)</span>
        </div>

        <div className="flex items-center space-x-2">
          {onTrackOnMap && (
            <button
              onClick={() => onTrackOnMap(bus)}
              className="px-2.5 py-1.5 rounded bg-[#2563EB]/10 text-[#38BDF8] hover:bg-[#2563EB]/20 border border-[#2563EB]/30 text-xs font-mono font-medium transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>TRACK</span>
            </button>
          )}

          <button
            onClick={() => navigate(`/bus/${bus.id}`)}
            className="px-2.5 py-1.5 rounded bg-[#131A24] hover:bg-[#182230] text-[#F0F4F8] border border-[#1B2432] text-xs font-medium transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8A99AD]" />
          </button>
        </div>
      </div>

    </div>
  );
};
