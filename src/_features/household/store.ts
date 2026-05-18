import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HouseholdStoreState {
  currentHouseholdId: string;
  setCurrentHouseholdId: (id: string) => void;
  detailRefreshKey: number;
  bumpDetailRefreshKey: () => void;
}

/**
 * `currentHouseholdId` 는 localStorage 에 영속화 — reload 시 즉시 hydrate.
 * 그래야 첫 진입 useSuspenseQuery 들이 X-Household-Id 헤더 누락으로 400 나는 걸 방지.
 * `detailRefreshKey` 는 세션 휘발 (persist 대상 X).
 */
export const useHouseholdStore = create<HouseholdStoreState>()(
  persist(
    (set) => ({
      currentHouseholdId: "",
      setCurrentHouseholdId: (currentHouseholdId) => set({ currentHouseholdId }),
      detailRefreshKey: 0,
      bumpDetailRefreshKey: () =>
        set((s) => ({ detailRefreshKey: s.detailRefreshKey + 1 })),
    }),
    {
      name: "household-store",
      partialize: (state) => ({ currentHouseholdId: state.currentHouseholdId }),
    },
  ),
);
