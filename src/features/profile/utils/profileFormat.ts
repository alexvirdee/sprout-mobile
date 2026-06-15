/**
 * Small formatting helpers for the profile. Warm + human.
 */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** "Member since June 2026" (undefined if no/invalid date). */
export function memberSinceLabel(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return `Member since ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "Unlocked Jun 14, 2026" (undefined if no/invalid date). */
export function unlockedDateLabel(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return `Unlocked ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

/** A safe display name with a friendly fallback. */
export function displayNameOr(name?: string | null, fallback = 'Friend'): string {
  return name && name.trim() ? name.trim() : fallback;
}
