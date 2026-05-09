"use client";

import { useQuery } from "@tanstack/react-query";

import { GetAccountListApi } from "../api";
import { accountKeys } from "./query-key";

export function useAccountListQuery() {
  return useQuery({
    queryKey: accountKeys.list,
    queryFn: async () => (await GetAccountListApi()).data.content,
  });
}
