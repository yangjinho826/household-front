"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DeletePortfolioApi,
  PostPortfolioCreateApi,
  PutPortfolioUpdateApi,
} from "../api";
import { portfolioKeys } from "./query-key";

export function useCreatePortfolioMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PostPortfolioCreateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: portfolioKeys.list }),
  });
}

export function useUpdatePortfolioMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PutPortfolioUpdateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: portfolioKeys.list }),
  });
}

export function useDeletePortfolioMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: DeletePortfolioApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: portfolioKeys.list }),
  });
}
