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

  // 거래 변경 시 — transaction 자체 + 잔액 의존 + 월간 통계 모두 stale
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
    queryClient.invalidateQueries({
      queryKey: queryKeys.fixed.monthlySummary._def,
      refetchType: "all",
    });
    // home 화면의 카테고리 통계 — 누락되어 거래 변경 후 stale 이었음
    queryClient.invalidateQueries({
      queryKey: queryKeys.stats._def,
      refetchType: "all",
    });
    // 페이지 진입용 overview 들도 stale — home(최근 거래/stats), wealth(잔액), settings(거래 카운트)
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
