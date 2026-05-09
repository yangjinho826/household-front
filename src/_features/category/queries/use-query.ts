"use client";

import { useQuery } from "@tanstack/react-query";

import { GetCategoryListApi } from "../api";
import { categoryKeys } from "./query-key";

export function useCategoryListQuery() {
  return useQuery({
    queryKey: categoryKeys.list,
    queryFn: async () => (await GetCategoryListApi()).data.content,
  });
}
