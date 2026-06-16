/**
 * Care domain types — mirror the backend CareTask model + suggestion shape.
 */

export type CareTaskType =
  | 'watering' | 'pruning' | 'fertilizing' | 'seed_starting' | 'transplanting' | 'harvesting' | 'general';
export type CareRecurrence = 'none' | 'daily' | 'weekly' | 'every_x_days' | 'monthly' | 'yearly';
export type CarePriority = 'low' | 'medium' | 'high';
export type CareSource = 'system' | 'user' | 'ai';
export type CareStatus = 'pending' | 'completed' | 'skipped';

export interface CareTask {
  id: string;
  userId: string;
  gardenId: string;
  plantId?: string | null;
  title: string;
  description?: string;
  taskType: CareTaskType;
  dueDate: string;
  completedAt?: string | null;
  skippedAt?: string | null;
  recurrence: CareRecurrence;
  recurrenceIntervalDays?: number | null;
  instructions?: string;
  videoUrl?: string;
  priority: CarePriority;
  source: CareSource;
  status: CareStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CareSuggestion {
  key: string;
  taskType: CareTaskType;
  title: string;
  detail: string;
  recurrence: CareRecurrence;
  recurrenceIntervalDays?: number;
  instructions: string;
  videoQuery?: string;
  priority: CarePriority;
  firstDueInDays: number;
}

export interface CareTaskPayload {
  gardenId: string;
  plantId?: string;
  title: string;
  description?: string;
  taskType?: CareTaskType;
  dueDate: string;
  recurrence?: CareRecurrence;
  recurrenceIntervalDays?: number;
  instructions?: string;
  videoUrl?: string;
  priority?: CarePriority;
}

export interface CareTaskListParams {
  dueBefore?: string;
  gardenId?: string;
  plantId?: string;
  status?: CareStatus | 'all';
}

/** Result of asking the server to AI-refine a plant's care suggestions. */
export interface AiCareSuggestionsResult {
  suggestions: CareSuggestion[];
  /** false when AI is unavailable and the rules were returned as-is. */
  aiUsed: boolean;
}

/**
 * Enabling suggestions as tasks. Pass `keys` for rules-based suggestions (the
 * server re-derives them), or full `suggestions` bodies for AI-refined ones
 * (whose tuned values can't be re-derived). `source` defaults to 'ai' when
 * suggestions are sent.
 */
export interface EnableCareInput {
  keys?: string[];
  suggestions?: CareSuggestion[];
  source?: 'system' | 'ai';
}
