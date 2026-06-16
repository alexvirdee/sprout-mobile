/**
 * useHomeLayout — device-local Home dashboard layout: section order, collapsed
 * state, and hidden state, persisted to SecureStore. Drives the collapsible
 * sections + the "Customize Home" editor.
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type HomeSectionKey = 'upcoming' | 'care' | 'attention' | 'health' | 'gardens' | 'activity';

export const HOME_SECTIONS: { key: HomeSectionKey; title: string }[] = [
  { key: 'upcoming', title: 'Upcoming care' },
  { key: 'care', title: "Today's care" },
  { key: 'attention', title: 'Needs attention' },
  { key: 'health', title: 'Garden health' },
  { key: 'gardens', title: 'Your gardens' },
  { key: 'activity', title: 'Recent activity' },
];

const DEFAULT_ORDER: HomeSectionKey[] = ['upcoming', 'care', 'attention', 'health', 'gardens', 'activity'];
const KEY = 'sprout.homeLayout';

type BoolMap = Record<HomeSectionKey, boolean>;
const emptyBool = (): BoolMap => ({
  upcoming: false,
  care: false,
  attention: false,
  health: false,
  gardens: false,
  activity: false,
});

interface HomeLayoutState {
  order: HomeSectionKey[];
  collapsed: BoolMap;
  hidden: BoolMap;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggleCollapsed: (key: HomeSectionKey) => void;
  toggleHidden: (key: HomeSectionKey) => void;
  move: (key: HomeSectionKey, dir: 'up' | 'down') => void;
  reset: () => void;
}

function save(state: Pick<HomeLayoutState, 'order' | 'collapsed' | 'hidden'>) {
  void SecureStore.setItemAsync(
    KEY,
    JSON.stringify({ order: state.order, collapsed: state.collapsed, hidden: state.hidden })
  ).catch(() => {});
}

export const useHomeLayout = create<HomeLayoutState>((set, get) => ({
  order: DEFAULT_ORDER,
  collapsed: emptyBool(),
  hidden: emptyBool(),
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await SecureStore.getItemAsync(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<{ order: HomeSectionKey[]; collapsed: BoolMap; hidden: BoolMap }>;
        const validOrder =
          Array.isArray(p.order) &&
          p.order.length === DEFAULT_ORDER.length &&
          DEFAULT_ORDER.every((k) => p.order!.includes(k));
        set({
          order: validOrder ? (p.order as HomeSectionKey[]) : DEFAULT_ORDER,
          collapsed: { ...emptyBool(), ...(p.collapsed ?? {}) },
          hidden: { ...emptyBool(), ...(p.hidden ?? {}) },
        });
      }
    } catch {
      /* fall back to defaults */
    }
    set({ hydrated: true });
  },

  toggleCollapsed: (key) => {
    const collapsed = { ...get().collapsed, [key]: !get().collapsed[key] };
    set({ collapsed });
    save({ order: get().order, collapsed, hidden: get().hidden });
  },

  toggleHidden: (key) => {
    const hidden = { ...get().hidden, [key]: !get().hidden[key] };
    set({ hidden });
    save({ order: get().order, collapsed: get().collapsed, hidden });
  },

  move: (key, dir) => {
    const order = [...get().order];
    const i = order.indexOf(key);
    const j = dir === 'up' ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    set({ order });
    save({ order, collapsed: get().collapsed, hidden: get().hidden });
  },

  reset: () => {
    const next = { order: DEFAULT_ORDER, collapsed: emptyBool(), hidden: emptyBool() };
    set(next);
    save(next);
  },
}));
