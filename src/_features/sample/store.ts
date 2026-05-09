import { create } from "zustand";

export type SampleEditType = "read" | "create" | "update";

interface SampleStoreState {
  selectedSample: string | null;
  editType: SampleEditType;
  setSelectedSample: (sampleId: string | null) => void;
  resetSelectedSample: () => void;
  setEditType: (t: SampleEditType) => void;
}

export const useSampleStore = create<SampleStoreState>((set) => ({
  selectedSample: null,
  editType: "read",
  setSelectedSample: (sampleId) => set({ selectedSample: sampleId }),
  resetSelectedSample: () => set({ selectedSample: null }),
  setEditType: (t) => set({ editType: t }),
}));
