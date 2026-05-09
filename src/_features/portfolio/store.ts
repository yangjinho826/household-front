import { create } from "zustand";

type PortfolioUiState = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

export const usePortfolioStore = create<PortfolioUiState>((set) => ({
  selectedId: null,
  setSelectedId: (selectedId) => set({ selectedId }),
}));
