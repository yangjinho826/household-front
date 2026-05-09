"use client";

import { useAccountListQuery } from "../queries/use-query";
import {
  useCreateAccountMutation,
  useDeleteAccountMutation,
  useUpdateAccountMutation,
} from "../queries/use-mutations";
import { useAccountStore } from "../store";

export function useAccount() {
  const selectedId = useAccountStore((s) => s.selectedId);
  const setSelectedId = useAccountStore((s) => s.setSelectedId);

  const listQ = useAccountListQuery();
  const accounts = listQ.data ?? [];
  const selectedAccount = accounts.find((a) => a.id === selectedId);

  const createM = useCreateAccountMutation();
  const updateM = useUpdateAccountMutation();
  const deleteM = useDeleteAccountMutation();

  return {
    accounts,
    isLoading: listQ.isLoading,
    selectedAccount,
    selectedId,
    setSelectedId,
    addAccount: createM.mutate,
    updateAccount: updateM.mutate,
    deleteAccount: deleteM.mutate,
  };
}
