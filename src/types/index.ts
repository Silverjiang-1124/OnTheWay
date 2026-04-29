export type GearCategory = 'sleep' | 'kitchen' | 'clothing' | 'food' | 'electronics' | 'other';

export const GEAR_CATEGORIES: { value: GearCategory; label: string }[] = [
  { value: 'sleep', label: '睡眠系统' },
  { value: 'kitchen', label: '饮食系统' },
  { value: 'clothing', label: '衣物' },
  { value: 'food', label: '路餐补给' },
  { value: 'electronics', label: '电子设备' },
  { value: 'other', label: '其他' },
];

export function gearCategoryLabel(cat: GearCategory): string {
  return GEAR_CATEGORIES.find(c => c.value === cat)?.label ?? cat;
}

export interface GearItem {
  id: string;
  name: string;
  category: GearCategory;
  brand?: string;
  weight?: number;
  quantity: number;
  notes?: string;
  createdAt: string;
}

export interface TripGear {
  gearId: string;
  packed: boolean;
  assignee?: Assignee;
}

export const ASSIGNEES = ['我', '队友', '公共'] as const;
export type Assignee = typeof ASSIGNEES[number];

export type TripStatus = 'planned' | 'completed';

export interface TripRiskInfo {
  weather?: string;
  supply?: string;
  transport?: string;
  emergency?: string;
  notes?: string;
}

export interface Trip {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  route?: string;
  trackUrl?: string;
  plan?: string;
  distance?: number;
  elevation?: number;
  riskInfo?: TripRiskInfo;
  members: string[];
  gearList: TripGear[];
  journal?: string;
  rating?: number;
  status: TripStatus;
  createdAt: string;
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export interface BackupData {
  version: number;
  exportedAt: string;
  gearItems: GearItem[];
  trips: Trip[];
}
