import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import {
  DeleteTransactionDeleteApi,
  PostTransactionCreateApi,
  PutTransactionUpdateApi,
} from "../api";
import type {
  TransactionCreateRequest,
  TransactionUpdateRequest,
} from "../types";

export function useTransactionMutations() {
  const queryClient = useQueryClient();

  // 거래 변경 시 통장 잔액(account.list) 도 같이 갱신 — 백엔드가 sum 으로 balance 계산
  const invalidateRelated = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.transaction._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.account.list._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.accountSnapshot._def,
      refetchType: "all",
    });
  };

  const createMutation = useMutation({
    mutationFn: (props: TransactionCreateRequest) =>
      PostTransactionCreateApi(props),
    onSuccess: invalidateRelated,
  });

  const updateMutation = useMutation({
    mutationFn: (props: TransactionUpdateRequest) =>
      PutTransactionUpdateApi(props),
    onSuccess: invalidateRelated,
  });

  const removeMutation = useMutation({
    mutationFn: (transactionId: string) =>
      DeleteTransactionDeleteApi(transactionId),
    onSuccess: invalidateRelated,
  });

  return { createMutation, updateMutation, removeMutation };
}
