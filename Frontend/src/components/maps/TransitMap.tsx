import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Bus, Route, Station } from '../../types';
import { createBusIcon, createStationIcon } from './mapIcons';
import { Maximize2, Minimize2, Compass, Layers, Eye, EyeOff, Bus as BusIcon, ArrowRight } from 'lucide-react';

interface TransitMapProps {
  buses: Bus[];
  routes?: Route[];
  stations?: Station[];
  selectedBusId?: string | null;
  onSelectBus?: (bus: Bus) => void;
  heightClass?: string;
  showAllRoutes?: boolean;
}

// Controller component inside MapContainer to smoothly handle view updates
const MapViewSetter: React.FC<{ center?: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

export const TransitMap: React.FC<TransitMapProps> = ({
  buses,
  routes = [],
  stations = [],
  selectedBusId,
  onSelectBus,
  heightClass = 'h-[500px]',
  showAllRoutes = true,
}) => {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRoutes, setShowRoutes] = useState(showAllRoutes);
  const [showStations, setShowStations] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.5937, 78.9629]); // India center
  const [mapZoom, setMapZoom] = useState(5);

  const selectedBus = buses.find((b) => b.id === selectedBusId);

  // If a bus is selected, center map on it
  useEffect(() => {
    if (selectedBus) {
      setMapCenter([selectedBus.currentLat, selectedBus.currentLng]);
      setMapZoom(9);
    }
  }, [selectedBusId]);

  const handleRecenterIndia = () => {
    setMapCenter([22.5937, 78.9629]);
    setMapZoom(5);
  };

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-[#202C3B] shadow-2xl bg-[#070A0F] ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none h-screen' : heightClass
    }`}>
      
      {/* Map Control Bar Overlay */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col space-y-2 select-none">
        
        {/* Recenter India Button */}
        <button
          onClick={handleRecenterIndia}
          className="p-2.5 bg-[#101925]/90 hover:bg-[#162233] text-[#F4F7FC] border border-[#202C3B] rounded-lg shadow-lg backdrop-blur-md transition-all flex items-center space-x-1.5 text-xs font-medium"
          title="Recenter India Network"
        >
          <Compass className="w-4 h-4 text-[#3185FF]" />
          <span className="hidden sm:inline">Fit All-India</span>
        </button>

        {/* Toggle Route Polylines */}
        <button
          onClick={() => setShowRoutes(!showRoutes)}
          className={`p-2.5 rounded-lg shadow-lg backdrop-blur-md transition-all flex items-center space-x-1.5 text-xs font-medium border ${
            showRoutes
              ? 'bg-[#3185FF]/20 text-[#55B5FF] border-[#3185FF]'
              : 'bg-[#101925]/90 text-[#8C9AAF] border-[#202C3B]'
          }`}
        >
          {showRoutes ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span className="hidden sm:inline">Routes</span>
        </button>

        {/* Toggle Station Markers */}
        <button
          onClick={() => setShowStations(!showStations)}
          className={`p-2.5 rounded-lg shadow-lg backdrop-blur-md transition-all flex items-center space-x-1.5 text-xs font-medium border ${
            showStations
              ? 'bg-[#3185FF]/20 text-[#55B5FF] border-[#3185FF]'
              : 'bg-[#101925]/90 text-[#8C9AAF] border-[#202C3B]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Stations</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 bg-[#101925]/90 hover:bg-[#162233] text-[#F4F7FC] border border-[#202C3B] rounded-lg shadow-lg backdrop-blur-md transition-all"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-[#101925]/90 border border-[#202C3B] p-2.5 rounded-lg backdrop-blur-md text-[11px] text-[#F4F7FC] space-y-1.5 shadow-lg select-none">
        <div className="font-semibold text-[#8C9AAF] uppercase tracking-wider text-[10px] mb-1">
          Telemetry Legend
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3185FF]"></span>
          <span>Moving Service</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
          <span>Delayed Service</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
          <span>Halted / Station Bay</span>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full dark-tiles"
        ref={mapRef}
        zoomControl={false}
      >
        <MapViewSetter center={mapCenter} zoom={mapZoom} />

        {/* Dark theme tile layer (Esri Dark Gray Canvas - free, high quality, no API key required) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.esri.com/">Esri</a>'
          url={
            import.meta.env.VITE_MAP_TILE_URL ||
            (import.meta.env.VITE_CARTO_API_KEY
              ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_CARTO_API_KEY}`
              : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}")
          }
          maxZoom={18}
        />

        {/* Route Polylines */}
        {showRoutes &&
          routes.map((rt) => (
            <Polyline
              key={rt.id}
              positions={rt.pathCoordinates}
              pathOptions={{
                color: selectedBus && selectedBus.routeId === rt.id ? '#55B5FF' : '#3185FF',
                weight: selectedBus && selectedBus.routeId === rt.id ? 4 : 2.2,
                opacity: selectedBus && selectedBus.routeId === rt.id ? 0.95 : 0.45,
                dashArray: selectedBus && selectedBus.routeId === rt.id ? undefined : '5, 8',
              }}
            />
          ))}

        {/* Station Markers */}
        {showStations &&
          stations.map((st) => (
            <Marker
              key={st.id}
              position={[st.lat, st.lng]}
              icon={createStationIcon(st.isHub)}
            >
              <Popup>
                <div className="p-1 max-w-xs">
                  <div className="text-xs font-semibold text-[#F4F7FC]">{st.name}</div>
                  <div className="text-[11px] text-[#8C9AAF] mt-0.5">{st.city}, {st.state}</div>
                  <div className="text-[10px] text-[#55B5FF] mt-1 font-mono">{st.platforms} Active Bay Platforms</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Bus Markers */}
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.currentLat, bus.currentLng]}
            icon={createBusIcon(bus.status, bus.id === selectedBusId)}
            eventHandlers={{
              click: () => {
                if (onSelectBus) onSelectBus(bus);
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[210px] space-y-2">
                <div className="flex items-center justify-between border-b border-[#202C3B] pb-1.5">
                  <div className="font-semibold text-xs text-[#F4F7FC] font-numeric">
                    {bus.registrationNumber}
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    bus.status === 'moving' ? 'bg-[#3185FF]/20 text-[#55B5FF]' :
                    bus.status === 'delayed' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                    'bg-[#EF4444]/20 text-[#EF4444]'
                  }`}>
                    {bus.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-[11px] text-[#8C9AAF]">
                  <div><strong className="text-[#F4F7FC]">Operator:</strong> {bus.operatorName}</div>
                  <div><strong className="text-[#F4F7FC]">Route:</strong> {bus.routeName}</div>
                  <div className="font-numeric"><strong className="text-[#F4F7FC]">Speed:</strong> {bus.speedKmH} km/h</div>
                  <div><strong className="text-[#F4F7FC]">Next Stop:</strong> {bus.nextStopName}</div>
                </div>

                <div className="pt-1 border-t border-[#202C3B] flex items-center justify-between">
                  <span className="text-[10px] text-[#5A687D]">ETA: {bus.estimatedArrivalTime}</span>
                  <button
                    onClick={() => navigate(`/bus/${bus.id}`)}
                    className="text-[11px] font-medium text-[#3185FF] hover:text-[#55B5FF] flex items-center space-x-1"
                  >
                    <span>Full Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
