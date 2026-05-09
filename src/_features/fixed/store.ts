import { create } from "zustand";

type FixedUiState = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

export const useFixedStore = create<FixedUiState>((set) => ({
  selectedId: null,
  setSelectedId: (selectedId) => set({ selectedId }),
}));
