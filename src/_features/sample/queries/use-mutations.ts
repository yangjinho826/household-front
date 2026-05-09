"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DeleteSampleApi,
  PostSampleCreateApi,
  PutSampleUpdateApi,
} from "../api";
import { sampleKeys } from "./query-key";

export function useCreateSampleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PostSampleCreateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: sampleKeys.list }),
  });
}

export function useUpdateSampleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PutSampleUpdateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: sampleKeys.list }),
  });
}

export function useDeleteSampleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: DeleteSampleApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: sampleKeys.list }),
  });
}
