"use client";

import { useQuery } from "@tanstack/react-query";

import { GetTransactionListApi } from "../api";
import { transactionKeys } from "./query-key";

export function useTransactionListQuery() {
  return useQuery({
    queryKey: transactionKeys.list,
    queryFn: async () => (await GetTransactionListApi()).data.content,
  });
}
