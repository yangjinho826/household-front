import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";
import { useIdempotentMutation } from "_libraries/hooks/use-idempotent-mutation";

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
    // account 도메인 전체 (list + infinite) — 잔액 의존 화면 모두 stale
    queryClient.invalidateQueries({
      queryKey: queryKeys.account._def,
      refetchType: "all",
    });
    // 투자·자산계좌 상세 overview(portfolio.byAccount) — 이체로 계좌 잔액이 바뀌면
    // 이 쿼리도 stale. 누락 시 거래 후 계좌 상세 잔액이 옛날 값으로 남는다.
    queryClient.invalidateQueries({
      queryKey: queryKeys.portfolio._def,
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

  const createMutation = useIdempotentMutation({
    mutationFn: (props: TransactionCreateRequest, idempotencyKey) =>
      PostTransactionCreateApi(props, idempotencyKey),
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
