import { create } from "zustand";

interface PortfolioStoreState {
  detailRefreshKey: number;
  bumpDetailRefreshKey: () => void;
}

export const usePortfolioStore = create<PortfolioStoreState>((set) => ({
  detailRefreshKey: 0,
  bumpDetailRefreshKey: () =>
    set((s) => ({ detailRefreshKey: s.detailRefreshKey + 1 })),
}));
