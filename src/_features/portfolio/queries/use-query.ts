"use client";

import { useQuery } from "@tanstack/react-query";

import { GetPortfolioListApi } from "../api";
import { portfolioKeys } from "./query-key";

export function usePortfolioListQuery() {
  return useQuery({
    queryKey: portfolioKeys.list,
    queryFn: async () => (await GetPortfolioListApi()).data.content,
  });
}
