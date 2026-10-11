import { Station } from '../types';

export const STATIONS: Station[] = [];

export const CITIES = Array.from(new Set(STATIONS.map((s) => s.city))).sort();
