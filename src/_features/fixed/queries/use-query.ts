"use client";

import { useQuery } from "@tanstack/react-query";

import { GetFixedListApi } from "../api";
import { fixedKeys } from "./query-key";

export function useFixedListQuery() {
  return useQuery({
    queryKey: fixedKeys.list,
    queryFn: async () => (await GetFixedListApi()).data.content,
  });
}
