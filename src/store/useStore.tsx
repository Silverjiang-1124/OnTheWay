import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { GearItem, Trip } from '../types';
import { genId } from '../types';
import { createSeedTrip } from './seedData';

const STORAGE_KEY = 'ontheway_data';
const CURRENT_VERSION = 2;

interface Store {
  gearItems: GearItem[];
  trips: Trip[];
  addGear: (item: Omit<GearItem, 'id' | 'createdAt'>) => void;
  updateGear: (id: string, data: Partial<GearItem>) => void;
  deleteGear: (id: string) => void;
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void;
  updateTrip: (id: string, data: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  togglePacked: (tripId: string, gearId: string) => void;
  addGearToTrip: (tripId: string, gearId: string, assignee?: string) => void;
  removeGearFromTrip: (tripId: string, gearId: string) => void;
}

interface StoreData {
  version: number;
  gearItems: GearItem[];
  trips: Trip[];
}

function loadData(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // v1 → v2: clear all gear items and trip gear lists
      if (!parsed.version || parsed.version < CURRENT_VERSION) {
        const migrated: StoreData = {
          version: CURRENT_VERSION,
          gearItems: [],
          trips: (parsed.trips || []).map((t: Trip) => ({
            ...t,
            gearList: [],
            members: t.members?.length ? t.members : ['我', '队友'],
          })),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
      return parsed;
    }
  } catch { /* ignore */ }
  // First visit — seed data (empty gear, trip with plan only)
  const seededTrip = createSeedTrip();
  const data: StoreData = { version: CURRENT_VERSION, gearItems: [], trips: [seededTrip] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function saveData(data: StoreData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const StoreContext = createContext<Store | null>(null);

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

  const addGearToTrip = (tripId: string, gearId: string, assignee?: string) => {
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

  return (
    <StoreContext.Provider value={{
      gearItems: data.gearItems, trips: data.trips,
      addGear, updateGear, deleteGear,
      addTrip, updateTrip, deleteTrip,
      togglePacked, addGearToTrip, removeGearFromTrip,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
