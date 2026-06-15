/**
 * useDailyGardenTip — a small, delightful gardening tip that rotates by date
 * (stable within a day). Static list for v1.
 */

export interface GardenTip {
  title: string;
  body: string;
}

const TIPS: GardenTip[] = [
  { title: 'Water at dawn', body: 'In warm climates, morning watering lets roots drink before the afternoon heat.' },
  { title: 'Mulch matters', body: 'A layer of mulch helps soil hold moisture and keeps roots cooler.' },
  { title: 'Deep, not often', body: 'Fewer deep waterings grow stronger roots than frequent shallow sips.' },
  { title: 'Pinch to bush out', body: 'Pinching herb tips encourages fuller, bushier growth.' },
  { title: 'Feed the soil', body: "Healthy soil grows healthy plants — compost is a gardener's best friend." },
  { title: 'Right plant, right spot', body: "Match a plant's sun needs to where it lives for happier growth." },
  { title: 'Check before you water', body: 'Poke a finger an inch into the soil — water only if it feels dry.' },
];

export function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export function useDailyGardenTip(): GardenTip {
  return TIPS[dayOfYear() % TIPS.length];
}
