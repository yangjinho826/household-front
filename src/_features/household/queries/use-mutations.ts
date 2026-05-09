import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

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

  const createMutation = useMutation({
    mutationFn: (props: HouseholdCreateRequest) =>
      PostHouseholdCreateApi(props),
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

  const addMemberMutation = useMutation({
    mutationFn: (props: MemberCreateRequest) =>
      PostHouseholdMemberCreateApi(props),
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
