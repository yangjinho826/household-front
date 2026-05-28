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

  // 통장 변경 시 — 다른 도메인 응답에 JOIN 된 account_name/balance 도 stale
  const invalidateRelated = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.account._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.transaction._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.portfolio._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.fixed._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.accountSnapshot._def,
      refetchType: "all",
    });
    // 페이지 overview — home(잔액/통장), wealth(통장/snapshot), settings(통장 카운트)
    queryClient.invalidateQueries({
      queryKey: queryKeys.home._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.wealth._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.settings._def,
      refetchType: "all",
    });
  };

  const createMutation = useMutation({
    mutationFn: (props: AccountCreateRequest) => PostAccountCreateApi(props),
    onSuccess: invalidateRelated,
  });

  const updateMutation = useMutation({
    mutationFn: (props: AccountUpdateRequest) => PutAccountUpdateApi(props),
    onSuccess: invalidateRelated,
  });

  const removeMutation = useMutation({
    mutationFn: (accountId: string) => DeleteAccountDeleteApi(accountId),
    onSuccess: invalidateRelated,
  });

  return { createMutation, updateMutation, removeMutation };
}
