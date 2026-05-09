"use client";

import { usePortfolioListQuery } from "../queries/use-query";
import {
  useCreatePortfolioMutation,
  useDeletePortfolioMutation,
  useUpdatePortfolioMutation,
} from "../queries/use-mutations";
import { usePortfolioStore } from "../store";

export function usePortfolio() {
  const selectedId = usePortfolioStore((s) => s.selectedId);
  const setSelectedId = usePortfolioStore((s) => s.setSelectedId);

  const listQ = usePortfolioListQuery();
  const portfolio = listQ.data ?? [];
  const selectedItem = portfolio.find((p) => p.id === selectedId);

  const createM = useCreatePortfolioMutation();
  const updateM = useUpdatePortfolioMutation();
  const deleteM = useDeletePortfolioMutation();

  return {
    portfolio,
    isLoading: listQ.isLoading,
    selectedItem,
    selectedId,
    setSelectedId,
    addPortfolio: createM.mutate,
    updatePortfolio: updateM.mutate,
    deletePortfolio: deleteM.mutate,
  };
}
