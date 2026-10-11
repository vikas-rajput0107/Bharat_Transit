import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Check, AlertTriangle, ShieldCheck, Activity, Terminal } from 'lucide-react';
import { useTransitStore } from '../../store/useTransitStore';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'Network Operations Overview',
  '/live': 'Live Network Tracking Map',
  '/buses': 'Fleet Directory & Search',
  '/plan': 'Intercity Journey Planner',
  '/stops': 'Station & Terminal Directory',
  '/saved': 'Saved Routes & Vehicles',
  '/alerts': 'Service Disruptions & Alerts',
  '/insights': 'Telemetry & Performance Analytics',
  '/settings': 'System & Interface Settings',
};

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { alerts, markAllAlertsAsRead, setCommandMenuOpen } = useTransitStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.read && !a.archived);
  const pageTitle = PAGE_TITLES[location.pathname] || (location.pathname.startsWith('/bus/') ? 'Vehicle Live Status' : 'Transit Operations');

  return (
    <header className="h-16 bg-[#0E131B] border-b border-[#1B2432] px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      
      {/* Left Title & System Scope */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-[#8A99AD] hover:text-[#F0F4F8] transition-colors rounded-md bg-[#131A24] border border-[#1B2432]"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#4E5F76] tracking-wider uppercase">
            <span>TRANSIT</span>
            <span>/</span>
            <span className="text-[#38BDF8] font-medium">INDIA CONTROL</span>
          </div>
          <h1 className="text-sm md:text-base font-semibold text-[#F0F4F8] leading-tight mt-0.5">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right Command Trigger & Alerts */}
      <div className="flex items-center space-x-3">
        
        {/* Global Search Bar Trigger */}
        <button
          onClick={() => setCommandMenuOpen(true)}
          className="hidden sm:flex items-center space-x-3 bg-[#131A24] border border-[#1B2432] hover:border-[#2A384C] px-3.5 py-1.5 rounded-md text-xs text-[#8A99AD] hover:text-[#F0F4F8] transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#4E5F76]" />
          <span>Search buses, terminals, routes...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#090C10] border border-[#1B2432] text-[#8A99AD] rounded">
            /
          </kbd>
        </button>

        <button
          onClick={() => setCommandMenuOpen(true)}
          className="sm:hidden p-2 text-[#8A99AD] hover:text-[#F0F4F8] rounded-md bg-[#131A24] border border-[#1B2432]"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[#8A99AD] hover:text-[#F0F4F8] transition-colors rounded-md bg-[#131A24] border border-[#1B2432] relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F43F5E] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0E131B] border border-[#1B2432] rounded-lg shadow-2xl overflow-hidden z-[9999] animate-in fade-in duration-150">
              <div className="p-3 bg-[#090C10] border-b border-[#1B2432] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F0F4F8]">
                    Network Alerts ({unreadAlerts.length})
                  </span>
                </div>
                {unreadAlerts.length > 0 && (
                  <button
                    onClick={markAllAlertsAsRead}
                    className="text-[11px] font-mono text-[#38BDF8] hover:underline flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#1B2432]">
                {unreadAlerts.length === 0 ? (
                  <div className="p-6 text-center text-[#8A99AD]">
                    <ShieldCheck className="w-8 h-8 text-[#10B981] mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-medium text-[#F0F4F8]">All corridors clear</p>
                    <p className="text-[11px] text-[#4E5F76] mt-0.5">No critical delays reported</p>
                  </div>
                ) : (
                  unreadAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/alerts');
                      }}
                      className="p-3 hover:bg-[#131A24] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-2.5">
                        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          alert.severity === 'critical' ? 'text-[#F43F5E]' : 'text-[#F59E0B]'
                        }`} />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-[#F0F4F8]">{alert.title}</div>
                          <div className="text-[11px] text-[#8A99AD] mt-0.5 line-clamp-2">{alert.description}</div>
                          <div className="text-[10px] font-mono text-[#4E5F76] mt-1">{alert.timestampText} • {alert.region}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-[#090C10] border-t border-[#1B2432] text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/alerts');
                  }}
                  className="text-xs font-mono text-[#2563EB] hover:text-[#38BDF8] font-medium"
                >
                  View All Service Alerts →
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
