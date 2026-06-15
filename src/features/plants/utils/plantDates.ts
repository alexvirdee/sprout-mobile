/**
 * plantDates — small date helpers for plants. Planted date is stored as an ISO
 * string; the form uses a YYYY-MM-DD value.
 */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Today as YYYY-MM-DD (for the form default). */
export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysSincePlanted(plantedDate?: string | null): number | null {
  if (!plantedDate) return null;
  const d = new Date(plantedDate);
  if (Number.isNaN(d.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  return days < 0 ? 0 : days;
}

/** "Planted today", "Planted 5 days ago", "Added recently" (when unknown). */
export function plantedLabel(plantedDate?: string | null): string {
  const days = daysSincePlanted(plantedDate);
  if (days == null) return 'Added recently';
  if (days === 0) return 'Planted today';
  if (days === 1) return 'Planted yesterday';
  if (days < 21) return `Planted ${days} days ago`;
  if (days < 60) return `Planted ${Math.round(days / 7)} weeks ago`;
  return `Planted ${Math.round(days / 30)} months ago`;
}

/** "Jun 16, 2026" for display; "Not set" when missing. */
export function formatPlantedDate(plantedDate?: string | null): string {
  if (!plantedDate) return 'Not set';
  const d = new Date(plantedDate);
  if (Number.isNaN(d.getTime())) return 'Not set';
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
