/**
 * Mock dashboard data — stands in for the API while the backend fills out.
 * Copy/voice follows the Sprout brand: warm, sensory, encouraging.
 */

import { DashboardData } from './types';

export const mockDashboard: DashboardData = {
  healthScore: 86,
  healthLabel: 'Thriving',
  stats: {
    plantsGrowing: 24,
    growingDelta: '+3',
    harvestedLabel: '18 lb',
  },
  watering: {
    count: 6,
    note: 'Best before the heat of the day',
  },
  tasks: [
    { id: 't1', title: 'Water the herb bed', completed: true },
    { id: 't2', title: 'Harvest the Sungolds', completed: false },
    { id: 't3', title: 'Add compost to Bed 2', completed: false },
  ],
  plants: [
    { id: 'p1', name: 'Cherry Tomato', emoji: '🍅', status: 'harvest', variety: 'Sungold', location: 'Bed 2', progress: 86 },
    { id: 'p2', name: 'Genovese Basil', emoji: '🌿', status: 'water', location: 'Herb planter', progress: 54 },
    { id: 'p3', name: 'Lavender', emoji: '💜', status: 'thriving', variety: 'Hidcote', location: 'Border', progress: 78 },
    { id: 'p4', name: 'Butter Lettuce', emoji: '🥬', status: 'thriving', location: 'Bed 1', progress: 62 },
  ],
  recentHarvests: [
    { id: 'h1', name: 'Sungold tomatoes', emoji: '🍅', amount: '1.2 lb', when: 'Today' },
    { id: 'h2', name: 'Basil', emoji: '🌿', amount: '4 stems', when: 'Yesterday' },
    { id: 'h3', name: 'Lettuce', emoji: '🥬', amount: '3 heads', when: '2 days ago' },
  ],
  seasonalTip: {
    eyebrow: 'In season',
    title: 'Early summer is for sowing',
    body: 'Direct-sow beans and squash now — the soil is warm and they will race ahead before the peak heat.',
  },
};
