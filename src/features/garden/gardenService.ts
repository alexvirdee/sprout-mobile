/**
 * gardenService — the dashboard data source. Today it returns mock data with a
 * simulated latency so the loading/empty states are real. Swapping to the live
 * API is a one-line change (commented below) once the backend endpoints land.
 */

import { DashboardData } from './types';
import { mockDashboard } from './mockData';
// import { apiClient } from '@services/apiClient';

const USE_MOCK = true;

export const gardenService = {
  getDashboard: async (): Promise<DashboardData> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      return mockDashboard;
    }
    // return apiClient.get<DashboardData>('/dashboard');
    return mockDashboard;
  },
};
