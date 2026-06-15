/**
 * Small formatting helpers. Sprout presents data quietly and warmly.
 */

/** "Good morning" / "Good afternoon" / "Good evening" based on local time. */
export function greeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** First name only, for friendly greetings. */
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? '';
}

/** A gentle relative day label: "Today", "Tomorrow", "In 3 days", "2 days ago". */
export function relativeDay(target: string | Date, now: Date = new Date()): string {
  const d = typeof target === 'string' ? new Date(target) : target;
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(d) - startOf(now)) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 1) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
}

/** A compact relative time: "Just now", "5m ago", "2h ago", else the day label. */
export function relativeTime(target: string | Date, now: Date = new Date()): string {
  const d = typeof target === 'string' ? new Date(target) : target;
  const mins = Math.floor((now.getTime() - d.getTime()) / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24 && d.getDate() === now.getDate()) return `${hrs}h ago`;
  return relativeDay(d, now);
}
