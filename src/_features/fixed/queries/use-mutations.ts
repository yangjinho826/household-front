"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DeleteFixedApi,
  PostFixedCreateApi,
  PutFixedUpdateApi,
} from "../api";
import { fixedKeys } from "./query-key";

export function useCreateFixedMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PostFixedCreateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: fixedKeys.list }),
  });
}

export function useUpdateFixedMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PutFixedUpdateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: fixedKeys.list }),
  });
}

export function useDeleteFixedMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: DeleteFixedApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: fixedKeys.list }),
  });
}
