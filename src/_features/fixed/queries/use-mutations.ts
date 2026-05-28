import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import {
  DeleteFixedDeleteApi,
  PostFixedCreateApi,
  PutFixedUpdateApi,
} from "../api";
import type { FixedCreateRequest, FixedUpdateRequest } from "../types";

export function useFixedMutations() {
  const queryClient = useQueryClient();

  // 고정지출 변경 시 — fixed list + detail + settings overview(고정지출 카운트)
  const invalidateRelated = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.fixed._def,
      refetchType: "all",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.settings._def,
      refetchType: "all",
    });
  };

  const createMutation = useMutation({
    mutationFn: (props: FixedCreateRequest) => PostFixedCreateApi(props),
    onSuccess: invalidateRelated,
  });

  const updateMutation = useMutation({
    mutationFn: (props: FixedUpdateRequest) => PutFixedUpdateApi(props),
    onSuccess: invalidateRelated,
  });

  const removeMutation = useMutation({
    mutationFn: (fixedId: string) => DeleteFixedDeleteApi(fixedId),
    onSuccess: invalidateRelated,
  });

  return { createMutation, updateMutation, removeMutation };
}
