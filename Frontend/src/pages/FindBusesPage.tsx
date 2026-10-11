import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRightLeft, ArrowUpDown, AlertCircle, Filter } from 'lucide-react';
import { searchBuses, BusSearchFilter } from '../services/transitService';
import { OPERATORS } from '../data/operators';
import { CITIES } from '../data/stations';
import { BusCard } from '../components/buses/BusCard';
import { Bus } from '../types';

export const FindBusesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [fromCity, setFromCity] = useState(searchParams.get('from') || '');
  const [toCity, setToCity] = useState(searchParams.get('to') || '');
  const [travelDate, setTravelDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [operatorId, setOperatorId] = useState('all');
  const [busType, setBusType] = useState('all');
  const [acFilter, setAcFilter] = useState<'all' | 'ac' | 'non-ac'>('all');
  const [maxFare, setMaxFare] = useState<number>(1500);
  const [sortBy, setSortBy] = useState<'departure' | 'arrival' | 'fare' | 'delay'>('departure');

  const [results, setResults] = useState<Bus[]>([]);

  useEffect(() => {
    const isAc = acFilter === 'ac' ? true : acFilter === 'non-ac' ? false : undefined;
    const filter: BusSearchFilter = {
      originQuery: fromCity,
      destinationQuery: toCity,
      travelDate,
      operatorId,
      busType,
      isAC: isAc,
      maxFare,
      sortBy,
    };
    setResults(searchBuses(filter));
  }, [fromCity, toCity, travelDate, operatorId, busType, acFilter, maxFare, sortBy]);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleClearFilters = () => {
    setFromCity('');
    setToCity('');
    setOperatorId('all');
    setBusType('all');
    setAcFilter('all');
    setMaxFare(1500);
    setSortBy('departure');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 select-none">
      
      {/* Search Header Console */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-5 space-y-5">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#4E5F76] mb-1">
            Fleet Search Directory
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#F0F4F8] tracking-tight">
            Find Intercity Bus Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Origin */}
          <div>
            <label className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider block mb-1.5">
              Origin City / Station
            </label>
            <div className="flex items-center bg-[#090C10] border border-[#1B2432] rounded px-3 py-2.5 focus-within:border-[#2563EB] transition-colors">
              <MapPin className="w-4 h-4 text-[#2563EB] mr-2.5 flex-shrink-0" />
              <input
                type="text"
                list="city-list"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="All Origins"
                className="w-full bg-transparent text-xs font-medium text-[#F0F4F8] focus:outline-none placeholder-[#4E5F76]"
              />
            </div>
          </div>

          {/* Swap & Destination */}
          <div className="relative flex items-end">
            <button
              type="button"
              onClick={handleSwap}
              className="absolute -top-3 sm:top-6 -left-3 sm:-left-3.5 z-10 p-1.5 bg-[#131A24] hover:bg-[#182230] border border-[#1B2432] text-[#38BDF8] rounded transition-transform hover:rotate-180 cursor-pointer"
              title="Swap origin & destination"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>

            <div className="w-full">
              <label className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider block mb-1.5">
                Destination City / Station
              </label>
              <div className="flex items-center bg-[#090C10] border border-[#1B2432] rounded px-3 py-2.5 focus-within:border-[#2563EB] transition-colors">
                <MapPin className="w-4 h-4 text-[#38BDF8] mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  list="city-list"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="All Destinations"
                  className="w-full bg-transparent text-xs font-medium text-[#F0F4F8] focus:outline-none placeholder-[#4E5F76]"
                />
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider block mb-1.5">
              Travel Date
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

          {/* Datalist */}
          <datalist id="city-list">
            {CITIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          {/* Sort */}
          <div>
            <label className="text-[10px] font-mono font-semibold text-[#4E5F76] uppercase tracking-wider block mb-1.5">
              Sort Results
            </label>
            <div className="flex items-center bg-[#090C10] border border-[#1B2432] rounded px-3 py-2.5">
              <ArrowUpDown className="w-4 h-4 text-[#8A99AD] mr-2.5 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-transparent text-xs font-medium text-[#F0F4F8] focus:outline-none"
              >
                <option value="departure">Earliest Departure</option>
                <option value="arrival">Earliest Arrival</option>
                <option value="fare">Lowest Fare (₹)</option>
                <option value="delay">Least Delayed</option>
              </select>
            </div>
          </div>

        </div>

        {/* Filter Controls Row */}
        <div className="pt-3 border-t border-[#1B2432] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Operator */}
            <div className="flex items-center space-x-2">
              <span className="text-[#4E5F76]">OPERATOR:</span>
              <select
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="bg-[#090C10] border border-[#1B2432] text-[#F0F4F8] rounded px-2.5 py-1 focus:outline-none"
              >
                <option value="all">ALL CORPORATIONS</option>
                {OPERATORS.map((op) => (
                  <option key={op.id} value={op.id}>{op.code}</option>
                ))}
              </select>
            </div>

            {/* AC Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[#4E5F76]">COMFORT:</span>
              <select
                value={acFilter}
                onChange={(e) => setAcFilter(e.target.value as any)}
                className="bg-[#090C10] border border-[#1B2432] text-[#F0F4F8] rounded px-2.5 py-1 focus:outline-none"
              >
                <option value="all">ALL TYPES</option>
                <option value="ac">AC ONLY</option>
                <option value="non-ac">NON-AC</option>
              </select>
            </div>

            {/* Fare Slider */}
            <div className="flex items-center space-x-2">
              <span className="text-[#4E5F76]">MAX FARE: ₹{maxFare}</span>
              <input
                type="range"
                min="300"
                max="1500"
                step="50"
                value={maxFare}
                onChange={(e) => setMaxFare(Number(e.target.value))}
                className="accent-[#2563EB] w-24 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="text-xs text-[#2563EB] hover:text-[#38BDF8] hover:underline cursor-pointer"
          >
            RESET FILTERS
          </button>

        </div>

      </div>

      {/* Results Title Bar */}
      <div className="flex items-center justify-between border-b border-[#1B2432] pb-2">
        <h3 className="text-sm font-semibold text-[#F0F4F8] font-mono">
          MATCHING SERVICES <span className="text-[#38BDF8]">({results.length})</span>
        </h3>
        <span className="text-[11px] font-mono text-[#4E5F76]">TELEMETRY UP TO DATE</span>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-12 text-center max-w-lg mx-auto space-y-3">
          <AlertCircle className="w-8 h-8 text-[#F59E0B] mx-auto opacity-80" />
          <h4 className="text-sm font-semibold text-[#F0F4F8]">No services match selected criteria</h4>
          <p className="text-xs text-[#8A99AD]">
            Try resetting filters or picking active corridors such as <button onClick={() => { setFromCity('Delhi'); setToCity('Jaipur'); }} className="text-[#38BDF8] underline">Delhi → Jaipur</button> or <button onClick={() => { setFromCity('Mumbai'); setToCity('Pune'); }} className="text-[#38BDF8] underline">Mumbai → Pune</button>.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-2 px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded hover:bg-[#1d4ed8] transition-colors cursor-pointer"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((bus) => (
            <BusCard
              key={bus.id}
              bus={bus}
              onTrackOnMap={(b) => navigate(`/live?bus=${b.id}`)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
