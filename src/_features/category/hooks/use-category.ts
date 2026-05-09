"use client";

import { useCategoryListQuery } from "../queries/use-query";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../queries/use-mutations";
import { useCategoryStore } from "../store";

export function useCategory() {
  const selectedId = useCategoryStore((s) => s.selectedId);
  const setSelectedId = useCategoryStore((s) => s.setSelectedId);

  const listQ = useCategoryListQuery();
  const categories = listQ.data ?? [];

  const createM = useCreateCategoryMutation();
  const updateM = useUpdateCategoryMutation();
  const deleteM = useDeleteCategoryMutation();

  return {
    categories,
    isLoading: listQ.isLoading,
    selectedId,
    setSelectedId,
    addCategory: createM.mutate,
    updateCategory: updateM.mutate,
    deleteCategory: deleteM.mutate,
  };
}
