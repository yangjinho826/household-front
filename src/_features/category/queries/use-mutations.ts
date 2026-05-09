"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DeleteCategoryApi,
  PostCategoryCreateApi,
  PutCategoryUpdateApi,
} from "../api";
import { categoryKeys } from "./query-key";

export function useCreateCategoryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PostCategoryCreateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.list }),
  });
}

export function useUpdateCategoryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PutCategoryUpdateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.list }),
  });
}

export function useDeleteCategoryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: DeleteCategoryApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.list }),
  });
}
