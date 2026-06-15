/**
 * Domain models — mirror the backend Mongoose schemas so the same shapes flow
 * from API → store → UI. Keep in sync with /server/src/models.
 */

export type AuthProvider = 'local' | 'google';

export type PlantStatus = 'thriving' | 'water' | 'harvest' | 'resting';

export type TaskType = 'water' | 'fertilize' | 'harvest' | 'prune' | 'plant' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider: AuthProvider;
  createdAt: string;
}

export interface Garden {
  id: string;
  userId: string;
  name: string;
  location?: string;
  size?: string;
  createdAt: string;
}

export interface Plant {
  id: string;
  gardenId: string;
  name: string;
  variety?: string;
  plantedDate: string;
  status: PlantStatus;
  /** Growth progress 0–100, used by PlantCard / ProgressRing. */
  progress?: number;
  emoji?: string;
  notes?: string;
}

export interface Task {
  id: string;
  plantId: string;
  type: TaskType;
  title: string;
  dueDate: string;
  completed: boolean;
}
