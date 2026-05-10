import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import {
  PostPortfolioBuyApi,
  PostPortfolioCreateApi,
  PostPortfolioSellApi,
  PutPortfolioUpdateApi,
} from "../api";
import type {
  PortfolioBuyRequest,
  PortfolioCreateRequest,
  PortfolioSellRequest,
  PortfolioUpdateRequest,
} from "../types";

export function usePortfolioMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.portfolio._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.account.list._def,
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

  return { createMutation, buyMutation, sellMutation, updateMutation };
}
