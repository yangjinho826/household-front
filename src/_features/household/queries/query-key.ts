import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { ApiPaginationProps } from "_libraries/fetch/response";

import {
  GetHouseholdDetailApi,
  GetHouseholdMembersApi,
  GetHouseholdSearchApi,
} from "../api";
import type { HouseholdSearchRequestType } from "../types";

export const households = createQueryKeys("household", {
  list: (params: HouseholdSearchRequestType & ApiPaginationProps) => ({
    queryKey: [params],
    queryFn: () => GetHouseholdSearchApi(params),
  }),
  detail: (householdId: string) => ({
    queryKey: [householdId],
    queryFn: () => GetHouseholdDetailApi(householdId),
  }),
  members: (householdId: string) => ({
    queryKey: ["members", householdId],
    queryFn: () => GetHouseholdMembersApi(householdId),
  }),
});
