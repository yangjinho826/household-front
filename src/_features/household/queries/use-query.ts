"use client";

import { useQuery } from "@tanstack/react-query";

import { GetAllMembersApi, GetHouseholdListApi } from "../api";
import { householdKeys } from "./query-key";

export function useHouseholdListQuery() {
  return useQuery({
    queryKey: householdKeys.list,
    queryFn: async () => (await GetHouseholdListApi()).data.content,
  });
}

export function useAllMembersQuery() {
  return useQuery({
    queryKey: householdKeys.members,
    queryFn: async () => (await GetAllMembersApi()).data,
  });
}
