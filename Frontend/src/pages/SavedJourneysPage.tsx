import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, ArrowRight, Bus as BusIcon, Route, MapPin } from 'lucide-react';
import { useTransitStore } from '../store/useTransitStore';

export const SavedJourneysPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedItems, removeSavedItem } = useTransitStore();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 select-none">
      
      {/* Header */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-5 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#4E5F76] mb-1">
            Browser Local Storage Sync
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#F0F4F8] tracking-tight">
            Saved Vehicles, Routes & Itineraries
          </h2>
          <p className="text-xs text-[#8A99AD] mt-0.5">
            Quick access to your bookmarked intercity services and transit itineraries.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-[#090C10] border border-[#1B2432] text-[#38BDF8] rounded">
          {savedItems.length} ITEMS
        </span>
      </div>

      {/* Saved Items Grid */}
      {savedItems.length === 0 ? (
        <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-12 text-center max-w-md mx-auto space-y-3">
          <Bookmark className="w-8 h-8 text-[#4E5F76] mx-auto" />
          <h3 className="text-sm font-semibold text-[#F0F4F8]">No bookmarked items</h3>
          <p className="text-xs text-[#8A99AD]">
            Bookmark buses, routes or itineraries while browsing to quickly track them anytime.
          </p>
          <button
            onClick={() => navigate('/buses')}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-mono font-semibold rounded transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <span>EXPLORE FLEET</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedItems.map((item) => (
            <div key={item.id} className="bg-[#0E131B] border border-[#1B2432] hover:border-[#2A384C] rounded p-4 transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded bg-[#090C10] border border-[#1B2432] flex items-center justify-center text-[#2563EB]">
                    {item.type === 'bus' && <BusIcon className="w-4 h-4" />}
                    {item.type === 'route' && <Route className="w-4 h-4" />}
                    {item.type === 'journey' && <MapPin className="w-4 h-4" />}
                    {item.type === 'station' && <MapPin className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#38BDF8]">
                      {item.type}
                    </span>
                    <h4 className="text-xs font-semibold text-[#F0F4F8]">{item.title}</h4>
                  </div>
                </div>

                <button
                  onClick={() => removeSavedItem(item.id)}
                  className="p-1.5 text-[#4E5F76] hover:text-[#F43F5E] rounded hover:bg-[#090C10] transition-colors cursor-pointer"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-[#8A99AD] leading-snug">{item.subtitle}</p>

              <div className="pt-2 border-t border-[#1B2432] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#4E5F76]">Saved {item.savedAt}</span>
                <button
                  onClick={() => {
                    if (item.type === 'bus') navigate(`/bus/${item.targetId}`);
                    else if (item.type === 'route') navigate(`/live?route=${item.targetId}`);
                    else if (item.type === 'journey') navigate('/plan');
                    else navigate('/stops');
                  }}
                  className="text-[#2563EB] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>OPEN ITEM</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
