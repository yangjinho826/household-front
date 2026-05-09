import { create } from "zustand";

type AccountUiState = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

export const useAccountStore = create<AccountUiState>((set) => ({
  selectedId: null,
  setSelectedId: (selectedId) => set({ selectedId }),
}));
