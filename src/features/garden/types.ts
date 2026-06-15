/**
 * Dashboard view-model types. These are shaped for the Home screen rather than
 * raw DB rows — the service composes them from plants/tasks/harvests.
 */

import { PlantStatus } from '@app-types/models';

export interface DashboardStat {
  plantsGrowing: number;
  growingDelta?: string;
  harvestedLabel: string;
}

export interface PlantSummary {
  id: string;
  name: string;
  emoji: string;
  status: PlantStatus;
  variety?: string;
  location?: string;
  /** Growth progress 0–100. */
  progress?: number;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface HarvestItem {
  id: string;
  name: string;
  emoji: string;
  amount: string;
  when: string;
}

export interface SeasonalTip {
  eyebrow: string;
  title: string;
  body: string;
}

export interface DashboardData {
  healthScore: number;
  healthLabel: string;
  stats: DashboardStat;
  watering: { count: number; note: string };
  tasks: TaskItem[];
  plants: PlantSummary[];
  recentHarvests: HarvestItem[];
  seasonalTip: SeasonalTip;
}
