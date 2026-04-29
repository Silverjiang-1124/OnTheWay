import { createContext } from 'react';
import type { Assignee, BackupData, GearItem, Trip } from '../types';

export interface Store {
  gearItems: GearItem[];
  trips: Trip[];
  addGear: (item: Omit<GearItem, 'id' | 'createdAt'>) => void;
  updateGear: (id: string, data: Partial<GearItem>) => void;
  deleteGear: (id: string) => void;
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void;
  updateTrip: (id: string, data: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  togglePacked: (tripId: string, gearId: string) => void;
  addGearToTrip: (tripId: string, gearId: string, assignee?: Assignee) => void;
  removeGearFromTrip: (tripId: string, gearId: string) => void;
  exportBackup: () => BackupData;
  importBackup: (backup: unknown, mode?: 'merge' | 'replace') => { gearCount: number; tripCount: number };
}

export const StoreContext = createContext<Store | null>(null);
