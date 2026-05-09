"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DeleteAccountApi,
  PostAccountCreateApi,
  PutAccountUpdateApi,
} from "../api";
import { accountKeys } from "./query-key";

export function useCreateAccountMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PostAccountCreateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.list }),
  });
}

export function useUpdateAccountMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PutAccountUpdateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.list }),
  });
}

export function useDeleteAccountMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: DeleteAccountApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: accountKeys.list }),
  });
}
