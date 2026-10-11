import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Navigation,
  Bus,
  Route,
  MapPin,
  Bookmark,
  AlertTriangle,
  BarChart3,
  Settings,
  X,
  Radio,
} from 'lucide-react';
import { useTransitStore } from '../../store/useTransitStore';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Live Tracking', path: '/live', icon: Navigation },
  { label: 'Find Buses', path: '/buses', icon: Bus },
  { label: 'Route Planner', path: '/plan', icon: Route },
  { label: 'Stops & Stations', path: '/stops', icon: MapPin },
  { label: 'Saved Journeys', path: '/saved', icon: Bookmark },
  { label: 'Service Alerts', path: '/alerts', icon: AlertTriangle, badgeKey: 'alerts' },
  { label: 'Network Insights', path: '/insights', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { alerts } = useTransitStore();
  const activeAlertsCount = alerts.filter((a) => !a.isResolved && !a.archived).length;

  const content = (
    <aside className="w-64 h-full bg-[#0E131B] border-r border-[#1B2432] flex flex-col justify-between select-none">
      
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#1B2432]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight text-[#F0F4F8] font-mono">
                TRANSIT<span className="text-[#38BDF8] ml-1 font-normal">SYS</span>
              </div>
              <div className="text-[10px] text-[#4E5F76] font-mono tracking-wider uppercase">
                Intercity Telemetry
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1 text-[#8A99AD] hover:text-[#F0F4F8] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Section Header */}
        <div className="px-5 pt-5 pb-2 text-[10px] font-mono font-semibold uppercase tracking-widest text-[#4E5F76]">
          Navigation
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `relative flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#182230] text-[#F0F4F8] border border-[#2A384C]'
                    : 'text-[#8A99AD] hover:text-[#F0F4F8] hover:bg-[#131A24]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Left Accent Bar for Active State */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#2563EB] rounded-r-full" />
                  )}

                  <div className="flex items-center space-x-3">
                    <item.icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#38BDF8]' : 'text-[#4E5F76] group-hover:text-[#8A99AD]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badgeKey === 'alerts' && activeAlertsCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#F43F5E]/10 text-[#F43F5E] border border-[#F43F5E]/30 rounded">
                      {activeAlertsCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Network Telemetry Pulse Footer */}
      <div className="p-4 border-t border-[#1B2432] bg-[#090C10]">
        <div className="flex items-start space-x-3 p-3 rounded-md bg-[#0E131B] border border-[#1B2432]">
          <Radio className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0 animate-pulse" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold text-[#F0F4F8]">SYSTEM ONLINE</span>
              <span className="text-[10px] font-mono text-[#10B981]">16 MS</span>
            </div>
            <p className="text-[11px] text-[#4E5F76] mt-0.5 truncate">
              Live feed • 16 States Active
            </p>
          </div>
        </div>
      </div>

    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 flex-shrink-0">
        {content}
      </div>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-[9999] md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
