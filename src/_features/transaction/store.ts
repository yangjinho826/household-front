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
