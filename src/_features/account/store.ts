import { create } from "zustand";

interface AccountStoreState {
  // 페이지 분리 패턴이라 selectedAccount 는 router.params 로 충분.
  // 이 store 는 향후 검색 외 UI 상태 (필터 토글 등) 를 담는 용도.
  detailRefreshKey: number;
  bumpDetailRefreshKey: () => void;
}

export const useAccountStore = create<AccountStoreState>((set) => ({
  detailRefreshKey: 0,
  bumpDetailRefreshKey: () =>
    set((s) => ({ detailRefreshKey: s.detailRefreshKey + 1 })),
}));

/**
 * 통장 추가/수정 시트 — 자산·통장 화면 곳곳의 트리거가 연다.
 * UserShell 안 AccountSheet 가 구독. editId 있으면 수정, 없으면 생성.
 */
interface AccountSheetState {
  opened: boolean;
  editId: string | null;
  /** 인자 없으면 생성, id 주면 해당 통장 수정 */
  open: (editId?: string) => void;
  close: () => void;
}

export const useAccountSheetStore = create<AccountSheetState>((set) => ({
  opened: false,
  editId: null,
  open: (editId?: string) => set({ opened: true, editId: editId ?? null }),
  close: () => set({ opened: false, editId: null }),
}));
