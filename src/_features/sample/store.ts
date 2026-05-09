import { create } from "zustand";

/**
 * Sample UI 상태 (Zustand).
 *
 * 서버 데이터(Sample[]) 는 TanStack Query 가 관리.
 * 여기엔 모달 토글 / 선택된 ID 만.
 */
type SampleUiState = {
  // 상세 바텀시트
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  // 폼 바텀시트
  isFormOpen: boolean;
  setFormOpen: (open: boolean) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;

  // 삭제 확인 모달
  confirmDelete: boolean;
  setConfirmDelete: (open: boolean) => void;
};

export const useSampleStore = create<SampleUiState>((set) => ({
  selectedId: null,
  setSelectedId: (selectedId) => set({ selectedId }),

  isFormOpen: false,
  setFormOpen: (isFormOpen) => set({ isFormOpen }),
  editingId: null,
  setEditingId: (editingId) => set({ editingId }),

  confirmDelete: false,
  setConfirmDelete: (confirmDelete) => set({ confirmDelete }),
}));
