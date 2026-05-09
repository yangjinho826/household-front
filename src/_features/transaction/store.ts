import { create } from "zustand";

export type TransactionView = "list" | "calendar";
export type TransactionFilter = "all" | "income" | "expense" | "transfer";

type TransactionUiState = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  view: TransactionView;
  setView: (view: TransactionView) => void;

  filter: TransactionFilter;
  setFilter: (filter: TransactionFilter) => void;
};

export const useTransactionStore = create<TransactionUiState>((set) => ({
  selectedId: null,
  setSelectedId: (selectedId) => set({ selectedId }),

  view: "list",
  setView: (view) => set({ view }),

  filter: "all",
  setFilter: (filter) => set({ filter }),
}));
