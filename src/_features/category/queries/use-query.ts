import {
  useInfiniteQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import { GetCategorySearchApi } from "../api";
import type { CategorySearchRequestType } from "../types";

export const useCategoryList = (
  params: CategorySearchRequestType & { limit?: number },
) => {
  return useSuspenseQuery(queryKeys.category.list(params));
};

export const useCategoryInfiniteList = (
  params: CategorySearchRequestType,
  pageSize = 30,
) => {
  const keyDef = queryKeys.category.infinite({ ...params, pageSize });
  return useInfiniteQuery({
    queryKey: keyDef.queryKey,
    queryFn: ({ pageParam }) =>
      GetCategorySearchApi({ ...params, cursor: pageParam, limit: pageSize }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      const { nextCursor, hasNext } = lastPage.body.data;
      return hasNext && nextCursor ? nextCursor : undefined;
    },
  });
};

export const useCategoryDetail = () => {
  const queryClient = useQueryClient();
  return async (categoryId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.category.detail(categoryId),
    });
  };
};
