import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteOff, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-[#101925] border border-[#202C3B] rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-[#3185FF]/10 border border-[#3185FF]/30 flex items-center justify-center mx-auto text-[#3185FF]">
          <RouteOff className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-[#55B5FF] uppercase tracking-wider">
            ERROR 404 • ROUTE UNMAPPED
          </span>
          <h2 className="text-xl font-bold text-[#F4F7FC]">Destination Page Not Found</h2>
          <p className="text-xs text-[#8C9AAF] leading-relaxed">
            The requested URL path does not exist in the transit route index or telemetry database.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#070A0F] border border-[#202C3B] hover:bg-[#162233] text-xs text-[#F4F7FC] font-semibold rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#3185FF] hover:bg-[#256fd8] text-white text-xs font-semibold rounded-lg transition-colors shadow-lg flex items-center space-x-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Overview Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
