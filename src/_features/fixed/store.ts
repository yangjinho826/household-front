import { create } from "zustand";

interface FixedStoreState {
  detailRefreshKey: number;
  bumpDetailRefreshKey: () => void;
}

export const useFixedStore = create<FixedStoreState>((set) => ({
  detailRefreshKey: 0,
  bumpDetailRefreshKey: () =>
    set((s) => ({ detailRefreshKey: s.detailRefreshKey + 1 })),
}));
