import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bus as BusIcon, Navigation, Bookmark, BookmarkCheck, Share2, ArrowLeft, Check, AlertTriangle, User, Phone } from 'lucide-react';
import { getBusById, getRouteById } from '../services/transitService';
import { useTransitStore } from '../store/useTransitStore';
import { TransitMap } from '../components/maps/TransitMap';
import { STATIONS } from '../data/stations';

export const BusDetailsPage: React.FC = () => {
  const { busId } = useParams<{ busId: string }>();
  const navigate = useNavigate();

  const { isSaved, toggleSaveItem, followedBusId, setFollowedBusId } = useTransitStore();
  const [copied, setCopied] = useState(false);

  const bus = busId ? getBusById(busId) : undefined;
  const route = bus ? getRouteById(bus.routeId) : undefined;
  const saved = bus ? isSaved('bus', bus.id) : false;
  const isFollowing = bus ? followedBusId === bus.id : false;

  if (!bus) {
    return (
      <div className="p-12 max-w-lg mx-auto text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-[#F43F5E] mx-auto opacity-80" />
        <h2 className="text-xl font-bold text-[#F0F4F8]">Vehicle Record Not Found</h2>
        <p className="text-xs text-[#8A99AD]">
          No active telemetry record matching vehicle ID "{busId}".
        </p>
        <button
          onClick={() => navigate('/buses')}
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-mono font-semibold rounded transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO DIRECTORY</span>
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `TRANSIT INDIA: Bus ${bus.registrationNumber} (${bus.operatorName}) - ${bus.routeName}. Next stop: ${bus.nextStopName}. ETA: ${bus.estimatedArrivalTime}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToggle = () => {
    toggleSaveItem({
      type: 'bus',
      targetId: bus.id,
      title: `${bus.operatorName} (${bus.registrationNumber})`,
      subtitle: bus.routeName,
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 select-none">
      
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 bg-[#0E131B] border border-[#1B2432] hover:bg-[#131A24] text-xs font-mono text-[#F0F4F8] rounded transition-colors flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <div className="flex items-center space-x-2 font-mono">
          <button
            onClick={() => {
              if (isFollowing) {
                setFollowedBusId(null);
              } else {
                setFollowedBusId(bus.id);
                navigate(`/live?bus=${bus.id}`);
              }
            }}
            className={`px-3 py-1.5 rounded border text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
              isFollowing
                ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/40'
                : 'bg-[#2563EB]/10 text-[#38BDF8] border-[#2563EB]/40 hover:bg-[#2563EB]/20'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{isFollowing ? 'FOLLOWING ON MAP' : 'FOLLOW ON MAP'}</span>
          </button>

          <button
            onClick={handleSaveToggle}
            className={`p-2 rounded border text-xs transition-colors cursor-pointer ${
              saved ? 'bg-[#2563EB]/10 text-[#38BDF8] border-[#2563EB]/40' : 'bg-[#0E131B] border-[#1B2432] text-[#4E5F76] hover:text-[#F0F4F8]'
            }`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCopy}
            className="p-2 bg-[#0E131B] border border-[#1B2432] hover:bg-[#131A24] text-[#4E5F76] hover:text-[#F0F4F8] rounded text-xs transition-colors cursor-pointer"
            title="Copy service details"
          >
            {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Vehicle Spec Card */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B2432] pb-5">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded bg-[#090C10] border border-[#1B2432] flex items-center justify-center flex-shrink-0">
              <BusIcon className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-[#F0F4F8] font-mono tracking-wide">
                  {bus.registrationNumber}
                </h2>
                <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                  bus.status === 'moving' ? 'bg-[#10B981]/10 text-[#10B981]' :
                  bus.status === 'delayed' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                  'bg-[#F43F5E]/10 text-[#F43F5E]'
                }`}>
                  {bus.status.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-[#8A99AD] mt-0.5 font-medium">
                {bus.operatorName} • Service #{bus.id}
              </div>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-xs text-[#4E5F76]">STANDARD FARE</div>
            <div className="text-2xl font-bold text-[#F0F4F8]">₹{bus.fareINR}</div>
            <div className="text-[11px] text-[#10B981]">{bus.availableSeats} of {bus.totalSeats} seats left</div>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#090C10] border border-[#1B2432] p-3.5 rounded">
            <div className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">SPEED</div>
            <div className="text-xl font-bold text-[#F0F4F8] font-mono mt-1">{bus.speedKmH} KM/H</div>
            <div className="text-[10px] font-mono text-[#38BDF8] mt-0.5">Live GPS</div>
          </div>

          <div className="bg-[#090C10] border border-[#1B2432] p-3.5 rounded">
            <div className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">SCHEDULE STATUS</div>
            <div className={`text-xl font-bold font-mono mt-1 ${bus.delayMinutes > 0 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
              {bus.delayMinutes > 0 ? `+${bus.delayMinutes} MIN` : 'ON TIME'}
            </div>
            <div className="text-[10px] font-mono text-[#4E5F76] mt-0.5">Updated {bus.lastUpdatedText}</div>
          </div>

          <div className="bg-[#090C10] border border-[#1B2432] p-3.5 rounded">
            <div className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">ROUTE PROGRESS</div>
            <div className="text-xl font-bold text-[#F0F4F8] font-mono mt-1">{bus.routeProgressPercent}%</div>
            <div className="w-full h-1 bg-[#131A24] rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-[#2563EB]" style={{ width: `${bus.routeProgressPercent}%` }} />
            </div>
          </div>

          <div className="bg-[#090C10] border border-[#1B2432] p-3.5 rounded">
            <div className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">NEXT STOP</div>
            <div className="text-xs font-bold text-[#F0F4F8] mt-1 truncate">{bus.nextStopName}</div>
            <div className="text-[10px] font-mono text-[#4E5F76] mt-0.5">ETA: {bus.nextStopEta}</div>
          </div>
        </div>

        {/* Assigned Driver Telemetry & Information */}
        {bus.driver && (
          <div className="bg-[#090C10] border border-[#1B2432] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-full bg-[#131A24] border border-[#2563EB]/40 flex items-center justify-center text-[#38BDF8] font-bold font-mono">
                <User className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider">
                  ASSIGNED BUS PILOT / DRIVER
                </div>
                <div className="text-sm font-bold text-[#F0F4F8] mt-0.5">{bus.driver.name}</div>
                <div className="text-[11px] text-[#8A99AD] font-mono">
                  License: <span className="text-[#F0F4F8]">{bus.driver.licenseNumber}</span> • {bus.driver.experienceYears} Years Driving Experience
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={`tel:${bus.driver.phone}`}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-mono text-[#10B981] hover:bg-[#10B981]/20 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{bus.driver.phone}</span>
              </a>
            </div>
          </div>
        )}

        {/* Live Route Map */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8A99AD]">
            <span className="font-semibold text-[#F0F4F8] uppercase tracking-wider">ROUTE MAP TELEMETRY</span>
            <span>[{bus.currentLat}, {bus.currentLng}]</span>
          </div>
          <TransitMap
            buses={[bus]}
            routes={route ? [route] : []}
            stations={STATIONS}
            selectedBusId={bus.id}
            heightClass="h-[350px]"
          />
        </div>

        {/* Intermediate Stops */}
        {route && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-semibold text-[#F0F4F8] uppercase tracking-wider">
              ROUTE SCHEDULE & INTERMEDIATE STOPS
            </h3>
            <div className="bg-[#090C10] border border-[#1B2432] rounded overflow-hidden divide-y divide-[#1B2432]">
              {route.intermediateStops.map((stop, index) => (
                <div key={index} className="p-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${stop.passed ? 'bg-[#10B981]' : 'bg-[#1B2432]'}`} />
                    <div>
                      <div className="font-semibold text-[#F0F4F8]">{stop.stationName}</div>
                      <div className="text-[11px] text-[#4E5F76]">{stop.cityName} • Bay {stop.platform || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[#F0F4F8]">Arr: {stop.arrivalTime}</div>
                    <div className="text-[10px] text-[#4E5F76]">{stop.distanceFromStartKm} KM</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
