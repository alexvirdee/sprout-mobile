/**
 * Journal domain types — mirror the backend JournalEntry model. A journal entry
 * is a harvest, a note, or a milestone in a garden's life. Harvests can carry a
 * quantity + unit + 1-5 rating; any entry may have one photo.
 */

export type JournalEntryType = 'harvest' | 'note' | 'milestone';
export type JournalUnit = 'count' | 'g' | 'kg' | 'oz' | 'lb' | 'bunch' | 'basket' | 'handful';

export interface JournalEntry {
  id: string;
  userId: string;
  gardenId: string;
  plantId?: string | null;
  careTaskId?: string | null;
  type: JournalEntryType;
  title?: string;
  note?: string;
  quantity?: number | null;
  unit?: JournalUnit | null;
  rating?: number | null;
  photoFileId?: string | null;
  /** Absolute URL the client can render directly (null when no photo). */
  photoUrl?: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryPayload {
  gardenId: string;
  plantId?: string;
  type?: JournalEntryType;
  title?: string;
  note?: string;
  quantity?: number;
  unit?: JournalUnit;
  rating?: number;
  careTaskId?: string;
  occurredAt?: string;
}

export interface JournalListParams {
  gardenId?: string;
  plantId?: string;
  type?: JournalEntryType;
  limit?: number;
}
