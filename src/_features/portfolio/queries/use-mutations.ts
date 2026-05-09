import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import {
  DeletePortfolioDeleteApi,
  PostPortfolioCreateApi,
  PutPortfolioUpdateApi,
} from "../api";
import type {
  PortfolioCreateRequest,
  PortfolioUpdateRequest,
} from "../types";

export function usePortfolioMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (props: PortfolioCreateRequest) => PostPortfolioCreateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolio.list._def,
        refetchType: "all",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (props: PortfolioUpdateRequest) => PutPortfolioUpdateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolio.list._def,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolio.detail._def,
        refetchType: "all",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (portfolioId: string) =>
      DeletePortfolioDeleteApi(portfolioId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.portfolio.list._def,
        refetchType: "all",
      });
    },
  });

  return { createMutation, updateMutation, removeMutation };
}
