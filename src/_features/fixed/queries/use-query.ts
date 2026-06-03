import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import { GetFixedSearchApi } from "../api";
import type { FixedSearchRequestType } from "../types";

export const useFixedInfiniteList = (
  params: FixedSearchRequestType,
  pageSize = 30,
) => {
  const keyDef = queryKeys.fixed.infinite({ ...params, pageSize });
  return useInfiniteQuery({
    queryKey: keyDef.queryKey,
    queryFn: ({ pageParam }) =>
      GetFixedSearchApi({ ...params, cursor: pageParam, limit: pageSize }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      const { nextCursor, hasNext } = lastPage.body.data;
      return hasNext && nextCursor ? nextCursor : undefined;
    },
  });
};

export const useFixedDetail = () => {
  const queryClient = useQueryClient();
  return async (fixedId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.fixed.detail(fixedId),
    });
  };
};
