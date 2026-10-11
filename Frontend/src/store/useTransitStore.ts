import { create } from 'zustand';
import { Bus, ServiceAlert, SavedItem, UserPreferences, NetworkMetrics } from '../types';
import { MOCK_BUSES } from '../data/buses';
import { MOCK_ALERTS } from '../data/alerts';
import { ROUTES } from '../data/routes';

const SAVED_STORAGE_KEY = 'india_transit_saved_v1';
const PREFS_STORAGE_KEY = 'india_transit_prefs_v1';
const ALERTS_STORAGE_KEY = 'india_transit_alerts_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  reducedMotion: false,
  mapAnimation: true,
  defaultRegion: 'All India',
  distanceUnit: 'km',
  demoNotifications: true,
  refreshRateSeconds: 2,
};

function getInitialSaved(): SavedItem[] {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [
      {
        id: 'save-bus-dl-01',
        type: 'bus',
        targetId: 'bus-dl-01',
        title: 'RSRTC DL-01-PC-9842',
        subtitle: 'Delhi — Jaipur Express',
        savedAt: new Date().toLocaleDateString(),
      },
      {
        id: 'save-rt-mum-pnq',
        type: 'route',
        targetId: 'rt-mum-pnq',
        title: 'Mumbai — Pune Shivneri AC Corridor',
        subtitle: '152 km • Every 15 mins',
        savedAt: new Date().toLocaleDateString(),
      }
    ];
  } catch (e) {
    return [];
  }
}

function getInitialPrefs(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch (e) {
    return DEFAULT_PREFERENCES;
  }
}

function getInitialAlerts(): ServiceAlert[] {
  try {
    const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (!raw) return MOCK_ALERTS;
    const storedState = JSON.parse(raw) as Record<string, { read: boolean; archived: boolean }>;
    return MOCK_ALERTS.map((alert) => ({
      ...alert,
      read: storedState[alert.id]?.read ?? alert.read,
      archived: storedState[alert.id]?.archived ?? false,
    }));
  } catch (e) {
    return MOCK_ALERTS;
  }
}

interface TransitStore {
  // Buses & Simulation State
  buses: Bus[];
  isSimulating: boolean;
  simulationSpeed: number; // 1, 2, 5, 10
  followedBusId: string | null;
  selectedBusId: string | null;
  
  // Alerts
  alerts: ServiceAlert[];
  
  // Saved Items
  savedItems: SavedItem[];

  // User Preferences
  preferences: UserPreferences;

  // Search & Global UI
  isCommandMenuOpen: boolean;
  globalSearchQuery: string;

  // Actions
  toggleSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  resetSimulation: () => void;
  setFollowedBusId: (id: string | null) => void;
  setSelectedBusId: (id: string | null) => void;
  
  // Alert Actions
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  archiveAlert: (id: string) => void;

  // Saved Actions
  toggleSaveItem: (item: Omit<SavedItem, 'id' | 'savedAt'>) => void;
  isSaved: (type: SavedItem['type'], targetId: string) => boolean;
  removeSavedItem: (id: string) => void;

  // Preference Actions
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  resetPreferences: () => void;

  // Global Search
  setCommandMenuOpen: (open: boolean) => void;
  setGlobalSearchQuery: (query: string) => void;

  // Simulation step
  tickSimulation: () => void;

  // Metrics calculation
  getMetrics: () => NetworkMetrics;
}

export const useTransitStore = create<TransitStore>((set, get) => ({
  buses: MOCK_BUSES,
  isSimulating: true,
  simulationSpeed: 1,
  followedBusId: null,
  selectedBusId: null,

  alerts: getInitialAlerts(),
  savedItems: getInitialSaved(),
  preferences: getInitialPrefs(),

  isCommandMenuOpen: false,
  globalSearchQuery: '',

  toggleSimulation: () => set((state) => ({ isSimulating: !state.isSimulating })),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

  resetSimulation: () => set({ buses: MOCK_BUSES }),

  setFollowedBusId: (id) => set({ followedBusId: id }),
  setSelectedBusId: (id) => set({ selectedBusId: id }),

  markAlertAsRead: (id) => {
    set((state) => {
      const nextAlerts = state.alerts.map((a) => (a.id === id ? { ...a, read: true } : a));
      const alertStateMap: Record<string, { read: boolean; archived: boolean }> = {};
      nextAlerts.forEach((a) => {
        alertStateMap[a.id] = { read: !!a.read, archived: !!a.archived };
      });
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alertStateMap));
      return { alerts: nextAlerts };
    });
  },

  markAllAlertsAsRead: () => {
    set((state) => {
      const nextAlerts = state.alerts.map((a) => ({ ...a, read: true }));
      const alertStateMap: Record<string, { read: boolean; archived: boolean }> = {};
      nextAlerts.forEach((a) => {
        alertStateMap[a.id] = { read: true, archived: !!a.archived };
      });
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alertStateMap));
      return { alerts: nextAlerts };
    });
  },

  archiveAlert: (id) => {
    set((state) => {
      const nextAlerts = state.alerts.map((a) => (a.id === id ? { ...a, archived: true } : a));
      const alertStateMap: Record<string, { read: boolean; archived: boolean }> = {};
      nextAlerts.forEach((a) => {
        alertStateMap[a.id] = { read: !!a.read, archived: !!a.archived };
      });
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alertStateMap));
      return { alerts: nextAlerts };
    });
  },

  toggleSaveItem: (item) => {
    set((state) => {
      const existing = state.savedItems.find((s) => s.type === item.type && s.targetId === item.targetId);
      let next: SavedItem[];
      if (existing) {
        next = state.savedItems.filter((s) => s.id !== existing.id);
      } else {
        const newItem: SavedItem = {
          ...item,
          id: `save-${item.type}-${item.targetId}`,
          savedAt: new Date().toLocaleDateString(),
        };
        next = [newItem, ...state.savedItems];
      }
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
      return { savedItems: next };
    });
  },

  isSaved: (type, targetId) => {
    return get().savedItems.some((s) => s.type === type && s.targetId === targetId);
  },

  removeSavedItem: (id) => {
    set((state) => {
      const next = state.savedItems.filter((s) => s.id !== id);
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
      return { savedItems: next };
    });
  },

  updatePreferences: (partial) => {
    set((state) => {
      const next = { ...state.preferences, ...partial };
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(next));
      return { preferences: next };
    });
  },

  resetPreferences: () => {
    set({ preferences: DEFAULT_PREFERENCES });
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
  },

  setCommandMenuOpen: (open) => set({ isCommandMenuOpen: open }),
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

  tickSimulation: () => {
    const { isSimulating, simulationSpeed, buses } = get();
    if (!isSimulating) return;

    const nextBuses = buses.map((bus) => {
      if (bus.status === 'stopped' || bus.status === 'scheduled') return bus;

      const route = ROUTES.find((r) => r.id === bus.routeId);
      if (!route || route.pathCoordinates.length < 2) return bus;

      const coords = route.pathCoordinates;
      let currentProgress = bus.routeProgressPercent + (0.4 * simulationSpeed);
      if (currentProgress >= 100) {
        currentProgress = 0; // loop route or reverse
      }

      // Calculate smooth interpolation along coords
      const totalSegments = coords.length - 1;
      const exactIndex = (currentProgress / 100) * totalSegments;
      const segIndex = Math.min(Math.floor(exactIndex), totalSegments - 1);
      const segT = exactIndex - segIndex;

      const p1 = coords[segIndex];
      const p2 = coords[segIndex + 1];

      const lat = p1[0] + (p2[0] - p1[0]) * segT;
      const lng = p1[1] + (p2[1] - p1[1]) * segT;

      return {
        ...bus,
        currentLat: Number(lat.toFixed(4)),
        currentLng: Number(lng.toFixed(4)),
        routeProgressPercent: Number(currentProgress.toFixed(1)),
        currentLegIndex: segIndex,
        lastUpdatedText: 'Just now',
      };
    });

    set({ buses: nextBuses });
  },

  getMetrics: () => {
    const buses = get().buses;
    const alerts = get().alerts;
    const activeBuses = buses.filter((b) => b.status === 'moving' || b.status === 'delayed').length;
    const activeAlerts = alerts.filter((a) => !a.isResolved && !a.archived).length;

    const delayedBuses = buses.filter((b) => b.delayMinutes > 0);
    const avgDelay = delayedBuses.length > 0
      ? Math.round(delayedBuses.reduce((acc, b) => acc + b.delayMinutes, 0) / delayedBuses.length)
      : 0;

    const onTimeCount = buses.filter((b) => b.delayMinutes <= 5).length;
    const onTimePercentage = Math.round((onTimeCount / (buses.length || 1)) * 100);

    return {
      totalBuses: buses.length,
      activeBuses,
      totalRoutes: ROUTES.length,
      activeAlerts,
      averageDelayMins: avgDelay,
      onTimePercentage,
      totalPassengersToday: 48920,
    };
  }
}));
