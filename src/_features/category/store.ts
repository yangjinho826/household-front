import { create } from "zustand";

type CategoryUiState = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

export const useCategoryStore = create<CategoryUiState>((set) => ({
  selectedId: null,
  setSelectedId: (selectedId) => set({ selectedId }),
}));
