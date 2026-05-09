"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DeleteTransactionApi,
  PostTransactionCreateApi,
  PutTransactionUpdateApi,
} from "../api";
import { transactionKeys } from "./query-key";

export function useCreateTransactionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PostTransactionCreateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: transactionKeys.list }),
  });
}

export function useUpdateTransactionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PutTransactionUpdateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: transactionKeys.list }),
  });
}

export function useDeleteTransactionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: DeleteTransactionApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: transactionKeys.list }),
  });
}
