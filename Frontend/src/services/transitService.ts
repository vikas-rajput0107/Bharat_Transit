import { STATIONS } from '../data/stations';
import { OPERATORS } from '../data/operators';
import { ROUTES } from '../data/routes';
import { MOCK_BUSES } from '../data/buses';
import { MOCK_JOURNEYS } from '../data/journeys';
import { Bus, Route, Station, Operator, Journey } from '../types';

export function getBusById(busId: string): Bus | undefined {
  return MOCK_BUSES.find((b) => b.id === busId);
}

export function getRouteById(routeId: string): Route | undefined {
  return ROUTES.find((r) => r.id === routeId);
}

export function getStationById(stationId: string): Station | undefined {
  return STATIONS.find((s) => s.id === stationId);
}

export function getOperatorById(operatorId: string): Operator | undefined {
  return OPERATORS.find((o) => o.id === operatorId);
}

export interface BusSearchFilter {
  originQuery?: string;
  destinationQuery?: string;
  travelDate?: string;
  isAC?: boolean;
  busType?: string;
  operatorId?: string;
  maxFare?: number;
  sortBy?: 'departure' | 'arrival' | 'fare' | 'duration' | 'delay';
}

export function searchBuses(filter: BusSearchFilter): Bus[] {
  let results = [...MOCK_BUSES];

  if (filter.originQuery && filter.originQuery.trim() !== '') {
    const q = filter.originQuery.toLowerCase().trim();
    results = results.filter(
      (b) => b.originName.toLowerCase().includes(q) || b.routeName.toLowerCase().includes(q)
    );
  }

  if (filter.destinationQuery && filter.destinationQuery.trim() !== '') {
    const q = filter.destinationQuery.toLowerCase().trim();
    results = results.filter(
      (b) => b.destinationName.toLowerCase().includes(q) || b.routeName.toLowerCase().includes(q)
    );
  }

  if (filter.isAC !== undefined) {
    results = results.filter((b) => b.isAC === filter.isAC);
  }

  if (filter.operatorId && filter.operatorId !== 'all') {
    results = results.filter((b) => b.operatorId === filter.operatorId);
  }

  if (filter.busType && filter.busType !== 'all') {
    results = results.filter((b) => b.serviceCategory === filter.busType);
  }

  if (filter.maxFare && filter.maxFare > 0) {
    results = results.filter((b) => b.fareINR <= filter.maxFare!);
  }

  // Sorting
  if (filter.sortBy) {
    results.sort((a, b) => {
      if (filter.sortBy === 'fare') return a.fareINR - b.fareINR;
      if (filter.sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
      if (filter.sortBy === 'arrival') return a.estimatedArrivalTime.localeCompare(b.estimatedArrivalTime);
      if (filter.sortBy === 'delay') return a.delayMinutes - b.delayMinutes;
      return 0;
    });
  }

  return results;
}

export function findJourneys(originCity: string, destinationCity: string): Journey[] {
  if (!originCity || !destinationCity) return MOCK_JOURNEYS;

  const o = originCity.toLowerCase().trim();
  const d = destinationCity.toLowerCase().trim();

  const matched = MOCK_JOURNEYS.filter(
    (j) => j.originCity.toLowerCase().includes(o) && j.destinationCity.toLowerCase().includes(d)
  );

  if (matched.length > 0) return matched;

  // Fallback dynamic generator if requested pairs are in sample stations
  const matchingBuses = MOCK_BUSES.filter(
    (b) =>
      b.originName.toLowerCase().includes(o) &&
      b.destinationName.toLowerCase().includes(d)
  );

  if (matchingBuses.length > 0) {
    return matchingBuses.map((b, idx) => ({
      id: `dyn-jrn-${b.id}-${idx}`,
      originCity: b.originName.split(' ')[0],
      destinationCity: b.destinationName.split(' ')[0],
      totalDurationMins: 310,
      totalDistanceKm: 280,
      totalFareINR: b.fareINR,
      transferCount: 0,
      departureTime: b.departureTime,
      arrivalTime: b.estimatedArrivalTime,
      legs: [
        {
          id: `dyn-leg-${b.id}`,
          busId: b.id,
          routeNumber: b.routeName,
          operatorName: b.operatorName,
          serviceCategory: b.serviceCategory,
          isAC: b.isAC,
          fromStationName: b.originName,
          toStationName: b.destinationName,
          departureTime: b.departureTime,
          arrivalTime: b.estimatedArrivalTime,
          durationMins: 310,
          fareINR: b.fareINR,
        }
      ]
    }));
  }

  return [];
}
