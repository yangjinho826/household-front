"use client";

import { useFixedListQuery } from "../queries/use-query";
import {
  useCreateFixedMutation,
  useDeleteFixedMutation,
  useUpdateFixedMutation,
} from "../queries/use-mutations";
import { useFixedStore } from "../store";

export function useFixed() {
  const selectedId = useFixedStore((s) => s.selectedId);
  const setSelectedId = useFixedStore((s) => s.setSelectedId);

  const listQ = useFixedListQuery();
  const fixed = listQ.data ?? [];

  const createM = useCreateFixedMutation();
  const updateM = useUpdateFixedMutation();
  const deleteM = useDeleteFixedMutation();

  return {
    fixed,
    isLoading: listQ.isLoading,
    selectedId,
    setSelectedId,
    addFixed: createM.mutate,
    updateFixed: updateM.mutate,
    deleteFixed: deleteM.mutate,
  };
}
