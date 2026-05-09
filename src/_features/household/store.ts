import { create } from "zustand";

interface HouseholdStoreState {
  currentHouseholdId: string;
  setCurrentHouseholdId: (id: string) => void;
  detailRefreshKey: number;
  bumpDetailRefreshKey: () => void;
}

export const useHouseholdStore = create<HouseholdStoreState>((set) => ({
  currentHouseholdId: "h-mock-1",
  setCurrentHouseholdId: (currentHouseholdId) => set({ currentHouseholdId }),
  detailRefreshKey: 0,
  bumpDetailRefreshKey: () =>
    set((s) => ({ detailRefreshKey: s.detailRefreshKey + 1 })),
}));
