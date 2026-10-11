export type BusStatus = 'moving' | 'delayed' | 'stopped' | 'scheduled';
export type ServiceCategory = 'Express' | 'Superfast' | 'AC Sleeper' | 'Volvo Multi-Axle' | 'Electric' | 'Ordinary State Transport';

export interface Station {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  address: string;
  platforms: number;
  amenities: string[];
  isHub?: boolean;
}

export interface Operator {
  id: string;
  name: string;
  code: string;
  state: string;
  rating: number;
  contactNumber: string;
  fleetSize: number;
  logoColor: string;
  type: 'Government STU' | 'Private Premium';
}

export interface StopTime {
  stationId: string;
  stationName: string;
  cityName: string;
  arrivalTime: string;
  departureTime: string;
  distanceFromStartKm: number;
  platform?: string;
  passed?: boolean;
}

export interface Route {
  id: string;
  routeNumber: string;
  name: string;
  originStationId: string;
  destinationStationId: string;
  totalDistanceKm: number;
  estimatedDurationMins: number;
  pathCoordinates: [number, number][]; // [lat, lng][]
  intermediateStops: StopTime[];
  frequencyText: string;
}

export interface Bus {
  id: string;
  registrationNumber: string;
  operatorId: string;
  operatorName: string;
  routeId: string;
  routeName: string;
  serviceCategory: ServiceCategory;
  isAC: boolean;
  totalSeats: number;
  availableSeats: number;
  currentLat: number;
  currentLng: number;
  speedKmH: number;
  status: BusStatus;
  delayMinutes: number;
  lastUpdatedText: string;
  routeProgressPercent: number; // 0 to 100
  currentLegIndex: number; // index along route pathCoordinates
  nextStopName: string;
  nextStopEta: string;
  originName: string;
  destinationName: string;
  departureTime: string;
  estimatedArrivalTime: string;
  fareINR: number;
  rating: number;
  amenities: string[];
  driver?: {
    name: string;
    phone: string;
    experienceYears: number;
    licenseNumber: string;
  };
}

export interface JourneyLeg {
  id: string;
  busId: string;
  routeNumber: string;
  operatorName: string;
  serviceCategory: ServiceCategory;
  isAC: boolean;
  fromStationName: string;
  toStationName: string;
  departureTime: string;
  arrivalTime: string;
  durationMins: number;
  fareINR: number;
}

export interface Journey {
  id: string;
  originCity: string;
  destinationCity: string;
  totalDurationMins: number;
  totalDistanceKm: number;
  totalFareINR: number;
  transferCount: number;
  legs: JourneyLeg[];
  departureTime: string;
  arrivalTime: string;
}

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertCategory = 'Delays' | 'Route Diversion' | 'Service Cancellation' | 'Station Congestion' | 'Weather Disruptions' | 'Maintenance';

export interface ServiceAlert {
  id: string;
  title: string;
  category: AlertCategory;
  severity: AlertSeverity;
  affectedRouteId?: string;
  affectedRouteName?: string;
  affectedStationId?: string;
  affectedStationName?: string;
  affectedBusId?: string;
  region: string;
  timestampText: string;
  description: string;
  isResolved: boolean;
  read?: boolean;
  archived?: boolean;
}

export interface SavedItem {
  id: string;
  type: 'bus' | 'route' | 'journey' | 'station';
  targetId: string;
  title: string;
  subtitle: string;
  savedAt: string;
  meta?: Record<string, any>;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  mapAnimation: boolean;
  defaultRegion: string;
  distanceUnit: 'km' | 'mi';
  demoNotifications: boolean;
  refreshRateSeconds: number;
}

export interface NetworkMetrics {
  totalBuses: number;
  activeBuses: number;
  totalRoutes: number;
  activeAlerts: number;
  averageDelayMins: number;
  onTimePercentage: number;
  totalPassengersToday: number;
}
