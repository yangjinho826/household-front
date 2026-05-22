import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";
import { useIdempotentMutation } from "_libraries/hooks/use-idempotent-mutation";

import {
  DeleteHouseholdDeleteApi,
  DeleteHouseholdMemberDeleteApi,
  PostHouseholdCreateApi,
  PostHouseholdMemberCreateApi,
  PutHouseholdUpdateApi,
} from "../api";
import type {
  HouseholdCreateRequest,
  HouseholdUpdateRequest,
  MemberCreateRequest,
} from "../types";

export function useHouseholdMutations() {
  const queryClient = useQueryClient();

  const createMutation = useIdempotentMutation({
    mutationFn: (props: HouseholdCreateRequest, idempotencyKey) =>
      PostHouseholdCreateApi(props, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.household.list._def,
        refetchType: "all",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (props: HouseholdUpdateRequest) =>
      PutHouseholdUpdateApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.household.list._def,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.household.detail._def,
        refetchType: "all",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (householdId: string) =>
      DeleteHouseholdDeleteApi(householdId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.household.list._def,
        refetchType: "all",
      });
    },
  });

  const addMemberMutation = useIdempotentMutation({
    mutationFn: (props: MemberCreateRequest, idempotencyKey) =>
      PostHouseholdMemberCreateApi(props, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.household.members._def,
        refetchType: "all",
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (props: { householdId: string; memberId: string }) =>
      DeleteHouseholdMemberDeleteApi(props.householdId, props.memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.household.members._def,
        refetchType: "all",
      });
    },
  });

  return {
    createMutation,
    updateMutation,
    removeMutation,
    addMemberMutation,
    removeMemberMutation,
  };
}
