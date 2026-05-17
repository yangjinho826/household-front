import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import {
  DeletePortfolioTxApi,
  GetPortfolioLookupApi,
  PostPortfolioBuyApi,
  PostPortfolioCreateApi,
  PostPortfolioSellApi,
  PutPortfolioTxUpdateApi,
  PutPortfolioUpdateApi,
} from "../api";
import type {
  Country,
  PortfolioBuyRequest,
  PortfolioCreateRequest,
  PortfolioSellRequest,
  PortfolioTxUpdateRequest,
  PortfolioUpdateRequest,
} from "../types";

export function usePortfolioMutations() {
  const queryClient = useQueryClient();

  // 포트폴리오 변경 시 — INVESTMENT 통장 잔액 + 자산 스냅샷 + 매수/매도 이력 + value-history 모두 영향
  // valueHistoryByAccount/Item 도 queryKeys.portfolio._def 안에 있어서 한 번에 invalidate
  const invalidateAll = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.portfolio._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.account._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.accountSnapshot._def,
      refetchType: "all",
    });
  };

  const createMutation = useMutation({
    mutationFn: (props: PortfolioCreateRequest) => PostPortfolioCreateApi(props),
    onSuccess: invalidateAll,
  });

  const buyMutation = useMutation({
    mutationFn: (props: PortfolioBuyRequest) => PostPortfolioBuyApi(props),
    onSuccess: invalidateAll,
  });

  const sellMutation = useMutation({
    mutationFn: (props: PortfolioSellRequest) => PostPortfolioSellApi(props),
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: (props: PortfolioUpdateRequest) => PutPortfolioUpdateApi(props),
    onSuccess: invalidateAll,
  });

  const updateTxMutation = useMutation({
    mutationFn: (props: PortfolioTxUpdateRequest) => PutPortfolioTxUpdateApi(props),
    onSuccess: invalidateAll,
  });

  const removeTxMutation = useMutation({
    mutationFn: (txId: string) => DeletePortfolioTxApi(txId),
    onSuccess: invalidateAll,
  });

  // 야후 파이낸스 조회 — 저장 X, 결과를 form 에 채우는 용도. 캐시 안 함.
  const lookupMutation = useMutation({
    mutationFn: (props: { country: Country; code: string }) =>
      GetPortfolioLookupApi(props.country, props.code),
  });

  return {
    createMutation,
    buyMutation,
    sellMutation,
    updateMutation,
    updateTxMutation,
    removeTxMutation,
    lookupMutation,
  };
}
