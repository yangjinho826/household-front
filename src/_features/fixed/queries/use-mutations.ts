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

  const createMutation = useMutation({
    mutationFn: (props: FixedCreateRequest) => PostFixedCreateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.fixed.list._def,
        refetchType: "all",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (props: FixedUpdateRequest) => PutFixedUpdateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.fixed.list._def,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.fixed.detail._def,
        refetchType: "all",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (fixedId: string) => DeleteFixedDeleteApi(fixedId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.fixed.list._def,
        refetchType: "all",
      });
    },
  });

  return { createMutation, updateMutation, removeMutation };
}
