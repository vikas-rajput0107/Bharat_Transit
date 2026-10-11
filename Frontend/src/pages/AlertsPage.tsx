import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Filter, ArrowRight } from 'lucide-react';
import { useTransitStore } from '../store/useTransitStore';
import { AlertCategory, AlertSeverity, ServiceAlert } from '../types';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, markAlertAsRead, markAllAlertsAsRead } = useTransitStore();

  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'all'>('all');

  const activeAlerts = alerts.filter((a) => !a.archived);

  const filteredAlerts = activeAlerts.filter((a) => {
    if (selectedSeverity !== 'all' && a.severity !== selectedSeverity) return false;
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 select-none">
      
      {/* Header Bar */}
      <div className="bg-[#0E131B] border border-[#1B2432] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#4E5F76] mb-1">
            Service Advisory Feed
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#F0F4F8] tracking-tight">
            Network Disruptions & Advisories
          </h2>
          <p className="text-xs text-[#8A99AD] mt-0.5">
            Advisories, weather warnings, highway diversions, and terminal maintenance notices across India.
          </p>
        </div>

        <button
          onClick={markAllAlertsAsRead}
          className="px-3.5 py-2 bg-[#131A24] border border-[#1B2432] hover:bg-[#182230] text-xs font-mono text-[#38BDF8] rounded transition-colors flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>MARK ALL READ</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-[#0E131B] border border-[#1B2432] p-3 rounded text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-[#4E5F76]" />
          <span className="text-[#4E5F76]">SEVERITY:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as any)}
            className="bg-[#090C10] border border-[#1B2432] text-[#F0F4F8] rounded px-2.5 py-1 focus:outline-none"
          >
            <option value="all">ALL SEVERITIES</option>
            <option value="critical">CRITICAL</option>
            <option value="high">HIGH</option>
            <option value="medium">MEDIUM</option>
            <option value="low">LOW</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[#4E5F76]">CATEGORY:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-[#090C10] border border-[#1B2432] text-[#F0F4F8] rounded px-2.5 py-1 focus:outline-none"
          >
            <option value="all">ALL CATEGORIES</option>
            <option value="Weather Disruptions">WEATHER DISRUPTIONS</option>
            <option value="Route Diversion">ROUTE DIVERSION</option>
            <option value="Station Congestion">STATION CONGESTION</option>
            <option value="Delays">DELAYS</option>
            <option value="Maintenance">MAINTENANCE</option>
          </select>
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => markAlertAsRead(alert.id)}
            className={`p-4 rounded border cursor-pointer transition-all space-y-3 ${
              !alert.read
                ? 'bg-[#182230] border-[#2563EB]'
                : 'bg-[#0E131B] border-[#1B2432] hover:bg-[#131A24]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  alert.severity === 'critical' ? 'bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/30' :
                  alert.severity === 'high' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30' :
                  'bg-[#2563EB]/10 text-[#38BDF8] border border-[#2563EB]/30'
                }`}>
                  {alert.severity}
                </span>
                <span className="text-xs font-mono text-[#8A99AD]">{alert.category}</span>
              </div>

              {!alert.read && (
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
              )}
            </div>

            <h3 className="text-sm font-bold text-[#F0F4F8]">{alert.title}</h3>
            <p className="text-xs text-[#8A99AD] leading-relaxed">{alert.description}</p>

            <div className="pt-2 border-t border-[#1B2432] flex items-center justify-between text-[10px] font-mono text-[#4E5F76]">
              <span>{alert.region} • {alert.timestampText}</span>
              {alert.affectedRouteId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/live?route=${alert.affectedRouteId}`);
                  }}
                  className="text-[#2563EB] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>AFFECTED ROUTE</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
