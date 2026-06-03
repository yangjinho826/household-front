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

/**
 * 가계부 추가/수정 시트 — 섹션 추가 버튼 + 가계부 스위처 두 곳이 연다.
 * UserShell 안 HouseholdSheet 가 구독. editId 있으면 수정, 없으면 생성.
 */
interface HouseholdSheetState {
  opened: boolean;
  editId: string | null;
  /** 인자 없으면 생성, id 주면 해당 가계부 수정 */
  open: (editId?: string) => void;
  close: () => void;
}

export const useHouseholdSheetStore = create<HouseholdSheetState>((set) => ({
  opened: false,
  editId: null,
  open: (editId?: string) => set({ opened: true, editId: editId ?? null }),
  close: () => set({ opened: false, editId: null }),
}));

/**
 * 멤버 관리 시트 — 설정에서 연다. householdId 로 그 가계부 멤버 초대/삭제.
 * UserShell 안 MembersSheet 가 구독.
 */
interface MembersSheetState {
  opened: boolean;
  householdId: string | null;
  open: (householdId: string) => void;
  close: () => void;
}

export const useMembersSheetStore = create<MembersSheetState>((set) => ({
  opened: false,
  householdId: null,
  open: (householdId: string) => set({ opened: true, householdId }),
  close: () => set({ opened: false, householdId: null }),
}));
