import { useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import type { AccountSnapshotYearlyRequest } from "../types";

export const useAccountSnapshotYearly = (
  params: AccountSnapshotYearlyRequest = {},
) => {
  return useSuspenseQuery(queryKeys.accountSnapshot.yearly(params));
};
