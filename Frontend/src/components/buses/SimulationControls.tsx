import React from 'react';
import { Play, Pause, RotateCcw, Radio } from 'lucide-react';
import { useTransitStore } from '../../store/useTransitStore';

export const SimulationControls: React.FC = () => {
  const {
    isSimulating,
    simulationSpeed,
    toggleSimulation,
    setSimulationSpeed,
    resetSimulation,
  } = useTransitStore();

  return (
    <div className="bg-[#0E131B] border border-[#1B2432] rounded p-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
      
      {/* Telemetry Status Indicator */}
      <div className="flex items-center space-x-2.5">
        <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'}`} />
        <div>
          <div className="text-xs font-mono font-semibold text-[#F0F4F8] flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>TELEMETRY SIMULATOR</span>
          </div>
          <div className="text-[10px] font-mono text-[#4E5F76]">
            {isSimulating ? `Active (${simulationSpeed}x realtime)` : 'Engine paused'}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-2">
        
        {/* Play/Pause */}
        <button
          onClick={toggleSimulation}
          className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 border cursor-pointer ${
            isSimulating
              ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 hover:bg-[#F59E0B]/20'
              : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/20'
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3 h-3" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              <span>RUN</span>
            </>
          )}
        </button>

        {/* Speed Selector */}
        <div className="flex items-center bg-[#090C10] border border-[#1B2432] rounded p-0.5">
          {[1, 2, 5, 10].map((speed) => (
            <button
              key={speed}
              onClick={() => setSimulationSpeed(speed)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                simulationSpeed === speed
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#8A99AD] hover:text-[#F0F4F8]'
              }`}
            >
              {speed}X
            </button>
          ))}
        </div>

        {/* Reset */}
        <button
          onClick={resetSimulation}
          className="p-1.5 bg-[#090C10] hover:bg-[#131A24] text-[#8A99AD] hover:text-[#F0F4F8] border border-[#1B2432] rounded transition-colors cursor-pointer"
          title="Reset positions to origin depots"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
