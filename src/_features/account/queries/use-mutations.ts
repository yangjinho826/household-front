import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import {
  DeleteAccountDeleteApi,
  PostAccountCreateApi,
  PutAccountUpdateApi,
} from "../api";
import type { AccountCreateRequest, AccountUpdateRequest } from "../types";

export function useAccountMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (props: AccountCreateRequest) => PostAccountCreateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.account.list._def,
        refetchType: "all",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (props: AccountUpdateRequest) => PutAccountUpdateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.account.list._def,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.account.detail._def,
        refetchType: "all",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (accountId: string) => DeleteAccountDeleteApi(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.account.list._def,
        refetchType: "all",
      });
    },
  });

  return { createMutation, updateMutation, removeMutation };
}
