import { useEffect, useState, type ReactNode } from 'react';
import { ASSIGNEES, genId, type Assignee, type BackupData, type GearItem, type Trip, type TripGear } from '../types';
import { createSeedTrip, seedGear } from './seedData';
import { StoreContext } from './storeContext';

const STORAGE_KEY = 'ontheway_data';
const CURRENT_VERSION = 5;

interface StoreData {
  version: number;
  gearItems: GearItem[];
  trips: Trip[];
}

function normalizeAssignee(value: unknown): Assignee | undefined {
  return ASSIGNEES.includes(value as Assignee) ? value as Assignee : undefined;
}

function normalizeGearItem(item: Partial<GearItem>): GearItem | null {
  if (!item.id || !item.name || !item.category) return null;
  return {
    id: String(item.id),
    name: String(item.name),
    category: item.category,
    brand: item.brand ? String(item.brand) : undefined,
    weight: typeof item.weight === 'number' && Number.isFinite(item.weight) ? item.weight : undefined,
    quantity: Math.max(1, Math.floor(Number(item.quantity)) || 1),
    notes: item.notes ? String(item.notes) : undefined,
    createdAt: item.createdAt ? String(item.createdAt) : new Date().toISOString(),
  };
}

function normalizeTripGear(item: Partial<TripGear>): TripGear | null {
  if (!item.gearId) return null;
  return {
    gearId: String(item.gearId),
    packed: Boolean(item.packed),
    assignee: normalizeAssignee(item.assignee),
  };
}

function normalizeTrip(item: Partial<Trip>): Trip | null {
  if (!item.id || !item.title || !item.location || !item.startDate || !item.endDate) return null;
  return {
    id: String(item.id),
    title: String(item.title),
    location: String(item.location),
    startDate: String(item.startDate),
    endDate: String(item.endDate),
    route: item.route ? String(item.route) : undefined,
    trackUrl: item.trackUrl ? String(item.trackUrl) : undefined,
    plan: item.plan ? String(item.plan) : undefined,
    distance: typeof item.distance === 'number' && Number.isFinite(item.distance) ? item.distance : undefined,
    elevation: typeof item.elevation === 'number' && Number.isFinite(item.elevation) ? item.elevation : undefined,
    riskInfo: item.riskInfo,
    members: Array.isArray(item.members) ? item.members.map(String).filter(Boolean) : [],
    gearList: Array.isArray(item.gearList) ? item.gearList.map(normalizeTripGear).filter((g): g is TripGear => Boolean(g)) : [],
    journal: item.journal ? String(item.journal) : undefined,
    rating: typeof item.rating === 'number' && item.rating >= 1 && item.rating <= 5 ? item.rating : undefined,
    status: item.status === 'completed' ? 'completed' : 'planned',
    createdAt: item.createdAt ? String(item.createdAt) : new Date().toISOString(),
  };
}

function mergeById<T extends { id: string }>(current: T[], incoming: T[]): T[] {
  const map = new Map(current.map(item => [item.id, item]));
  for (const item of incoming) map.set(item.id, item);
  return Array.from(map.values());
}

function normalizeData(raw: unknown): StoreData | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Partial<StoreData>;
  const gearItems = Array.isArray(data.gearItems)
    ? data.gearItems.map(normalizeGearItem).filter((g): g is GearItem => Boolean(g))
    : [];
  const trips = Array.isArray(data.trips)
    ? data.trips.map(normalizeTrip).filter((t): t is Trip => Boolean(t))
    : [];
  return { version: CURRENT_VERSION, gearItems, trips };
}

function loadData(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const normalized = normalizeData(JSON.parse(raw));
      if (normalized) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    }
  } catch { /* ignore corrupted local data and reseed */ }

  const seededTrip = createSeedTrip();
  const data: StoreData = { version: CURRENT_VERSION, gearItems: seedGear, trips: [seededTrip] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function saveData(data: StoreData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function parseBackup(backup: unknown): StoreData {
  const normalized = normalizeData(backup);
  if (!normalized || (!normalized.gearItems.length && !normalized.trips.length)) {
    throw new Error('备份文件格式不正确');
  }
  return normalized;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(loadData);

  useEffect(() => { saveData(data); }, [data]);

  const addGear = (item: Omit<GearItem, 'id' | 'createdAt'>) => {
    const newItem: GearItem = { ...item, id: genId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, gearItems: [...prev.gearItems, newItem] }));
  };

  const updateGear = (id: string, patch: Partial<GearItem>) => {
    setData(prev => ({
      ...prev,
      gearItems: prev.gearItems.map(g => g.id === id ? { ...g, ...patch } : g),
    }));
  };

  const deleteGear = (id: string) => {
    setData(prev => ({
      ...prev,
      gearItems: prev.gearItems.filter(g => g.id !== id),
      trips: prev.trips.map(t => ({
        ...t,
        gearList: t.gearList.filter(tg => tg.gearId !== id),
      })),
    }));
  };

  const addTrip = (trip: Omit<Trip, 'id' | 'createdAt'>) => {
    const newTrip: Trip = { ...trip, id: genId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, trips: [...prev.trips, newTrip] }));
  };

  const updateTrip = (id: string, patch: Partial<Trip>) => {
    setData(prev => ({
      ...prev,
      trips: prev.trips.map(t => t.id === id ? { ...t, ...patch } : t),
    }));
  };

  const deleteTrip = (id: string) => {
    setData(prev => ({ ...prev, trips: prev.trips.filter(t => t.id !== id) }));
  };

  const togglePacked = (tripId: string, gearId: string) => {
    setData(prev => ({
      ...prev,
      trips: prev.trips.map(t =>
        t.id !== tripId ? t : {
          ...t,
          gearList: t.gearList.map(tg =>
            tg.gearId === gearId ? { ...tg, packed: !tg.packed } : tg
          ),
        }
      ),
    }));
  };

  const addGearToTrip = (tripId: string, gearId: string, assignee?: Assignee) => {
    setData(prev => ({
      ...prev,
      trips: prev.trips.map(t =>
        t.id !== tripId ? t : {
          ...t,
          gearList: t.gearList.some(tg => tg.gearId === gearId)
            ? t.gearList
            : [...t.gearList, { gearId, packed: false, assignee }],
        }
      ),
    }));
  };

  const removeGearFromTrip = (tripId: string, gearId: string) => {
    setData(prev => ({
      ...prev,
      trips: prev.trips.map(t =>
        t.id !== tripId ? t : {
          ...t,
          gearList: t.gearList.filter(tg => tg.gearId !== gearId),
        }
      ),
    }));
  };

  const exportBackup = (): BackupData => ({
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    gearItems: data.gearItems,
    trips: data.trips,
  });

  const importBackup = (backup: unknown, mode: 'merge' | 'replace' = 'merge') => {
    const incoming = parseBackup(backup);
    setData(prev => ({
      version: CURRENT_VERSION,
      gearItems: mode === 'replace' ? incoming.gearItems : mergeById(prev.gearItems, incoming.gearItems),
      trips: mode === 'replace' ? incoming.trips : mergeById(prev.trips, incoming.trips),
    }));
    return { gearCount: incoming.gearItems.length, tripCount: incoming.trips.length };
  };

  return (
    <StoreContext.Provider value={{
      gearItems: data.gearItems, trips: data.trips,
      addGear, updateGear, deleteGear,
      addTrip, updateTrip, deleteTrip,
      togglePacked, addGearToTrip, removeGearFromTrip,
      exportBackup, importBackup,
    }}>
      {children}
    </StoreContext.Provider>
  );
}
