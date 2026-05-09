import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type { HouseholdSearchRequestType } from "../types";

export const useHouseholdList = (
  params: HouseholdSearchRequestType & ApiPaginationProps,
) => {
  return useSuspenseQuery(queryKeys.household.list(params));
};

export const useHouseholdMembers = (householdId: string) => {
  return useSuspenseQuery(queryKeys.household.members(householdId));
};

export const useHouseholdDetail = () => {
  const queryClient = useQueryClient();
  return async (householdId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.household.detail(householdId),
    });
  };
};
