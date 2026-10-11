import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTransitStore } from './store/useTransitStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandMenu } from './components/layout/CommandMenu';

import { OverviewPage } from './pages/OverviewPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { FindBusesPage } from './pages/FindBusesPage';
import { RoutePlannerPage } from './pages/RoutePlannerPage';
import { BusDetailsPage } from './pages/BusDetailsPage';
import { StopsPage } from './pages/StopsPage';
import { SavedJourneysPage } from './pages/SavedJourneysPage';
import { AlertsPage } from './pages/AlertsPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const { tickSimulation, isSimulating, simulationSpeed } = useTransitStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Run telemetry simulation loop
  useEffect(() => {
    if (!isSimulating) return;
    const intervalTime = Math.max(200, 1500 / simulationSpeed);
    const timer = setInterval(() => {
      tickSimulation();
    }, intervalTime);
    return () => clearInterval(timer);
  }, [isSimulating, simulationSpeed, tickSimulation]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#090C10] text-[#F0F4F8] flex flex-col md:flex-row font-sans antialiased selection:bg-[#2563EB] selection:text-white">
        
        {/* Persistent Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Command Search Palette Modal */}
        <CommandMenu />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header Bar */}
          <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          {/* Page View Routes */}
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/live" element={<LiveMapPage />} />
              <Route path="/buses" element={<FindBusesPage />} />
              <Route path="/plan" element={<RoutePlannerPage />} />
              <Route path="/bus/:busId" element={<BusDetailsPage />} />
              <Route path="/stops" element={<StopsPage />} />
              <Route path="/saved" element={<SavedJourneysPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

        </div>

      </div>
    </BrowserRouter>
  );
};

export default App;
