import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { useTransitStore } from '../store/useTransitStore';

export const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences, resetPreferences, resetSimulation } = useTransitStore();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTriggerReset = () => {
    resetPreferences();
    resetSimulation();
    setShowConfirmReset(false);
    setSuccessMessage('System preferences & simulation state restored to defaults.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 select-none">
      
      {/* Header */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-5">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#4E5F76] mb-1">
          Client Configuration
        </div>
        <h2 className="text-xl font-bold text-[#F0F4F8]">System Preferences & Engine Options</h2>
        <p className="text-xs text-[#8A99AD] mt-0.5">
          Configure telemetry update speeds, map render preferences, and local state persistence.
        </p>
      </div>

      {successMessage && (
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] p-3 rounded text-xs font-mono flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Settings Panel */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-6 space-y-6">
        
        {/* Map & Telemetry Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F0F4F8] border-b border-[#1B2432] pb-2">
            Map & Telemetry Engine
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#F0F4F8]">Smooth Coordinate Animation</div>
              <div className="text-[11px] text-[#8A99AD]">Animate vehicle markers smoothly along polyline segments</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.mapAnimation}
              onChange={(e) => updatePreferences({ mapAnimation: e.target.checked })}
              className="accent-[#2563EB] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#F0F4F8]">Distance Units</div>
              <div className="text-[11px] text-[#8A99AD]">Preferred unit for route lengths and vehicle speed telemetry</div>
            </div>
            <select
              value={preferences.distanceUnit}
              onChange={(e) => updatePreferences({ distanceUnit: e.target.value as any })}
              className="bg-[#090C10] border border-[#1B2432] text-xs font-mono text-[#F0F4F8] rounded px-2.5 py-1 focus:outline-none"
            >
              <option value="km">Kilometers (km, km/h)</option>
              <option value="mi">Miles (mi, mph)</option>
            </select>
          </div>
        </div>

        {/* Destructive Resets */}
        <div className="space-y-4 pt-4 border-t border-[#1B2432]">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F43F5E] border-b border-[#1B2432] pb-2">
            Reset State
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#F0F4F8]">Reset Local Data & Positions</div>
              <div className="text-[11px] text-[#8A99AD]">Clears local bookmarks and resets simulation telemetry positions</div>
            </div>

            <button
              onClick={() => setShowConfirmReset(true)}
              className="px-3 py-1.5 bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/30 hover:bg-[#F43F5E]/20 rounded text-xs font-mono transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RESET SYSTEM STATE</span>
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded bg-[#F43F5E]/10 border border-[#F43F5E]/30 flex items-center justify-center text-[#F43F5E]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F0F4F8]">Reset System State?</h3>
                <p className="text-xs text-[#8A99AD]">Restores default sample dataset and clears local bookmarks.</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 bg-[#090C10] border border-[#1B2432] text-xs font-mono text-[#8A99AD] hover:text-[#F0F4F8] rounded cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleTriggerReset}
                className="px-4 py-1.5 bg-[#F43F5E] hover:bg-[#e11d48] text-white text-xs font-mono font-semibold rounded cursor-pointer"
              >
                CONFIRM RESET
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
