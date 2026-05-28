import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

export const useHouseholdList = () => {
  return useSuspenseQuery(queryKeys.household.list());
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
