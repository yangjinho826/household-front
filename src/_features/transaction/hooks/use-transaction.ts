"use client";

import { useTransactionListQuery } from "../queries/use-query";
import {
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateTransactionMutation,
} from "../queries/use-mutations";
import { useTransactionStore } from "../store";

export function useTransaction() {
  const selectedId = useTransactionStore((s) => s.selectedId);
  const setSelectedId = useTransactionStore((s) => s.setSelectedId);

  const listQ = useTransactionListQuery();
  const transactions = listQ.data ?? [];
  const selectedTransaction = transactions.find((t) => t.id === selectedId);

  const createM = useCreateTransactionMutation();
  const updateM = useUpdateTransactionMutation();
  const deleteM = useDeleteTransactionMutation();

  return {
    transactions,
    isLoading: listQ.isLoading,
    selectedTransaction,
    selectedId,
    setSelectedId,
    addTransaction: createM.mutate,
    updateTransaction: updateM.mutate,
    deleteTransaction: deleteM.mutate,
  };
}
