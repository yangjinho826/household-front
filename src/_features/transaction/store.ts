import { create } from "zustand";

interface TransactionStoreState {
  detailRefreshKey: number;
  bumpDetailRefreshKey: () => void;
}

export const useTransactionStore = create<TransactionStoreState>((set) => ({
  detailRefreshKey: 0,
  bumpDetailRefreshKey: () =>
    set((s) => ({ detailRefreshKey: s.detailRefreshKey + 1 })),
}));

/**
 * 거래 입력 시트 — 어디서나 + FAB·거래 탭 [+]·거래 row 클릭으로 열림.
 * UserShell 안 QuickAddSheet 가 이 store 를 구독. editId 있으면 수정, 없으면 생성.
 */
interface QuickAddStoreState {
  opened: boolean;
  editId: string | null;
  /** 인자 없으면 생성, id 주면 해당 거래 수정 */
  open: (editId?: string) => void;
  close: () => void;
}

export const useQuickAddStore = create<QuickAddStoreState>((set) => ({
  opened: false,
  editId: null,
  open: (editId?: string) => set({ opened: true, editId: editId ?? null }),
  close: () => set({ opened: false, editId: null }),
}));
