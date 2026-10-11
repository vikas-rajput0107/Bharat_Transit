import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { STATIONS, CITIES } from './data/stations';
import { MOCK_BUSES } from './data/buses';
import { ROUTES } from './data/routes';
import { OPERATORS } from './data/operators';
import { MOCK_ALERTS } from './data/alerts';
import { MOCK_JOURNEYS } from './data/journeys';

async function initializeApp() {
  try {
    const API_BASE = 'http://localhost:5000/api';
    
    // Fetch all data from the Express backend
    const [stationsData, busesData, routesData, operatorsData, alertsData, journeysData] = await Promise.all([
      fetch(`${API_BASE}/stations`).then(r => r.json()),
      fetch(`${API_BASE}/buses`).then(r => r.json()),
      fetch(`${API_BASE}/routes`).then(r => r.json()),
      fetch(`${API_BASE}/operators`).then(r => r.json()),
      fetch(`${API_BASE}/alerts`).then(r => r.json()),
      fetch(`${API_BASE}/journeys`).then(r => r.json()),
    ]);

    // Populate data arrays in-place so all files importing them get the data!
    STATIONS.push(...stationsData);
    
    const uniqueCities = Array.from(new Set(stationsData.map((s: any) => s.city))).sort();
    CITIES.push(...uniqueCities as string[]);
    
    MOCK_BUSES.push(...busesData);
    ROUTES.push(...routesData);
    OPERATORS.push(...operatorsData);
    MOCK_ALERTS.push(...alertsData);
    MOCK_JOURNEYS.push(...journeysData);
    
    console.log("Successfully connected to backend and loaded data!");
  } catch (error) {
    console.error("Backend connection failed! Is http://localhost:5000 running?", error);
    document.body.innerHTML = "<h2 style='color: white; font-family: sans-serif; padding: 20px;'>Backend connection failed! Is the Node.js server running on port 5000?</h2>";
    return;
  }

  // Dynamically import App only AFTER data is fetched, 
  // so Zustand store and components get the fully populated arrays
  const { default: App } = await import('./App.tsx');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

initializeApp();
