import { useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import type { AccountSnapshotSearchRequestType } from "../types";

export const useAccountSnapshotList = (
  params: AccountSnapshotSearchRequestType,
) => {
  return useSuspenseQuery(queryKeys.accountSnapshot.list(params));
};
