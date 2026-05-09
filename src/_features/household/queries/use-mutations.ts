"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DeleteHouseholdApi,
  DeleteMemberApi,
  PostHouseholdCreateApi,
  PostMemberCreateApi,
  PutHouseholdUpdateApi,
} from "../api";
import { householdKeys } from "./query-key";

export function useCreateHouseholdMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PostHouseholdCreateApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: householdKeys.list });
      qc.invalidateQueries({ queryKey: householdKeys.members });
    },
  });
}

export function useUpdateHouseholdMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PutHouseholdUpdateApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: householdKeys.list }),
  });
}

export function useDeleteHouseholdMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: DeleteHouseholdApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: householdKeys.list });
      qc.invalidateQueries({ queryKey: householdKeys.members });
    },
  });
}

export function useCreateMemberMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      householdId,
      ...rest
    }: Parameters<typeof PostMemberCreateApi>[1] & { householdId: string }) =>
      PostMemberCreateApi(householdId, rest),
    onSuccess: () => qc.invalidateQueries({ queryKey: householdKeys.members }),
  });
}

export function useDeleteMemberMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ householdId, memberId }: { householdId: string; memberId: string }) =>
      DeleteMemberApi(householdId, memberId),
    onSuccess: () => qc.invalidateQueries({ queryKey: householdKeys.members }),
  });
}
