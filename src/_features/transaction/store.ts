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
 * 빠른 거래 입력 시트 — 어디서나 + FAB 또는 거래 탭 [+] 누르면 시트 열림.
 * UserShell 안 QuickAddSheet 가 이 store 의 opened 구독.
 */
interface QuickAddStoreState {
  opened: boolean;
  open: () => void;
  close: () => void;
}

export const useQuickAddStore = create<QuickAddStoreState>((set) => ({
  opened: false,
  open: () => set({ opened: true }),
  close: () => set({ opened: false }),
}));
