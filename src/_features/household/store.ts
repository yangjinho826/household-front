import { create } from "zustand";

import type { User } from "./types";

/**
 * Household / 사용자 UI 상태 (Zustand).
 *
 * - user: 인증 후 hydrate (mock 단계 직접 setUser)
 * - currentHouseholdId: 현재 선택된 가계부
 * - showSwitcher: 가계부 전환 모달
 */
type HouseholdUiState = {
  user: User | null;
  setUser: (user: User | null) => void;

  currentHouseholdId: string;
  setCurrentHouseholdId: (id: string) => void;

  showSwitcher: boolean;
  setShowSwitcher: (open: boolean) => void;
};

export const useHouseholdStore = create<HouseholdUiState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  currentHouseholdId: "h1",
  setCurrentHouseholdId: (currentHouseholdId) => set({ currentHouseholdId }),

  showSwitcher: false,
  setShowSwitcher: (showSwitcher) => set({ showSwitcher }),
}));
