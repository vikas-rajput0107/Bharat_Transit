import L from 'leaflet';
import { BusStatus } from '../../types';

export function createBusIcon(status: BusStatus, isSelected: boolean = false) {
  let color = '#3185FF'; // moving electric blue
  if (status === 'delayed') color = '#F59E0B'; // warning amber
  if (status === 'stopped') color = '#EF4444'; // stopped red
  if (status === 'scheduled') color = '#8C9AAF';

  const selectedRing = isSelected
    ? `<div style="position:absolute; inset:-6px; border:2px solid #55B5FF; border-radius:50%; animation: pulse-ring 1.5s infinite;"></div>`
    : '';

  const html = `
    <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
      ${selectedRing}
      <div style="width:30px; height:30px; background:#101925; border:2px solid ${color}; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 6v6"/>
          <path d="M16 6v6"/>
          <path d="M2 12h20"/>
          <path d="M18 18h2"/>
          <path d="M4 18h2"/>
          <rect width="16" height="16" x="4" y="3" rx="2"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-bus-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

export function createStationIcon(isHub: boolean = false) {
  const color = isHub ? '#55B5FF' : '#8C9AAF';
  const size = isHub ? 22 : 16;
  const html = `
    <div style="width:${size}px; height:${size}px; background:#101925; border:2px solid ${color}; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
      <div style="width:${size / 2}px; height:${size / 2}px; background:${color}; border-radius:50%;"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-station-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
