import { createQueryKeys } from "@lukemorales/query-key-factory";

import {
  GetHouseholdDetailApi,
  GetHouseholdMembersApi,
  GetHouseholdSearchApi,
} from "../api";

export const households = createQueryKeys("household", {
  list: () => ({
    queryKey: ["list"],
    queryFn: () => GetHouseholdSearchApi(),
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
