import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";
import { useIdempotentMutation } from "_libraries/hooks/use-idempotent-mutation";

import {
  DeleteManualAssetApi,
  PostManualAssetCreateApi,
  PutManualAssetUpdateApi,
} from "../api";
import type {
  ManualAssetCreateRequest,
  ManualAssetUpdateRequest,
} from "../types";

export function useManualAssetMutations() {
  const queryClient = useQueryClient();

  // 수동자산 변경 → 전용계좌 잔액 + 총자산/배분 + 스냅샷 모두 영향 (portfolio 패턴과 동일)
  const invalidateAll = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.manualAsset._def,
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
    mutationFn: (props: ManualAssetCreateRequest, idempotencyKey) =>
      PostManualAssetCreateApi(props, idempotencyKey),
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: (props: ManualAssetUpdateRequest) =>
      PutManualAssetUpdateApi(props),
    onSuccess: invalidateAll,
  });

  const removeMutation = useMutation({
    mutationFn: (manualAssetId: string) => DeleteManualAssetApi(manualAssetId),
    onSuccess: invalidateAll,
  });

  return { createMutation, updateMutation, removeMutation };
}
