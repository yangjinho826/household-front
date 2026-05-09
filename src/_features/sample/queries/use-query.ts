"use client";

import { useQuery } from "@tanstack/react-query";

import { GetSampleListApi } from "../api";
import { sampleKeys } from "./query-key";

export function useSampleListQuery() {
  return useQuery({
    queryKey: sampleKeys.list,
    queryFn: async () => (await GetSampleListApi()).data.content,
  });
}
