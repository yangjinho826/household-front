"use client";

import { useSampleListQuery } from "../queries/use-query";
import {
  useCreateSampleMutation,
  useDeleteSampleMutation,
  useUpdateSampleMutation,
} from "../queries/use-mutations";
import { useSampleStore } from "../store";
import type { Sample } from "../types";

/**
 * Sample 메인 훅 — queries + store + 파생값을 ctx 객체로.
 *
 * Provider (`context.tsx`) 가 이 훅의 ReturnType 으로 자동 매핑.
 * 컴포넌트는 `useSampleContext()` 로 소비.
 */
export function useSample() {
  // UI 상태 (Zustand)
  const selectedId = useSampleStore((s) => s.selectedId);
  const setSelectedId = useSampleStore((s) => s.setSelectedId);
  const isFormOpen = useSampleStore((s) => s.isFormOpen);
  const setFormOpen = useSampleStore((s) => s.setFormOpen);
  const editingId = useSampleStore((s) => s.editingId);
  const setEditingId = useSampleStore((s) => s.setEditingId);
  const confirmDelete = useSampleStore((s) => s.confirmDelete);
  const setConfirmDelete = useSampleStore((s) => s.setConfirmDelete);

  // 서버 데이터 (TanStack Query)
  const listQ = useSampleListQuery();
  const samples = listQ.data ?? [];

  // Mutations
  const createM = useCreateSampleMutation();
  const updateM = useUpdateSampleMutation();
  const deleteM = useDeleteSampleMutation();

  // 파생값
  const selectedSample = samples.find((s) => s.id === selectedId);
  const editingSample = samples.find((s) => s.id === editingId);
  const isDetailOpen = !!selectedId;

  // 액션 헬퍼
  const openCreateForm = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const openEditForm = (sample: Sample) => {
    setSelectedId(null); // 상세 닫고
    setEditingId(sample.id);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  const openDetail = (id: string) => setSelectedId(id);
  const closeDetail = () => setSelectedId(null);

  return {
    // 데이터
    samples,
    isLoading: listQ.isLoading,
    selectedSample,
    editingSample,

    // 모달 상태
    isFormOpen,
    isDetailOpen,
    confirmDelete,
    setConfirmDelete,

    // 액션
    openCreateForm,
    openEditForm,
    closeForm,
    openDetail,
    closeDetail,

    // CRUD
    createSample: createM.mutate,
    updateSample: updateM.mutate,
    deleteSample: deleteM.mutate,
    isMutating:
      createM.isPending || updateM.isPending || deleteM.isPending,
  };
}
