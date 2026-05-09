import { create } from "zustand";

interface CategoryStoreState {
  detailRefreshKey: number;
  bumpDetailRefreshKey: () => void;
}

export const useCategoryStore = create<CategoryStoreState>((set) => ({
  detailRefreshKey: 0,
  bumpDetailRefreshKey: () =>
    set((s) => ({ detailRefreshKey: s.detailRefreshKey + 1 })),
}));
