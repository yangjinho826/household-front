import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import {
  DeleteSampleDeleteApi,
  PostSampleCreateApi,
  PutSampleUpdateApi,
} from "../api";
import type { SampleCreateRequest, SampleUpdateRequest } from "../types";

export function useSampleMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (props: SampleCreateRequest) => PostSampleCreateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sample.list._def,
        refetchType: "all",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (props: SampleUpdateRequest) => PutSampleUpdateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sample.list._def,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.sample.detail._def,
        refetchType: "all",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (sampleId: string) => DeleteSampleDeleteApi(sampleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sample.list._def,
        refetchType: "all",
      });
    },
  });

  return { createMutation, updateMutation, removeMutation };
}
