import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";
import type { ApiPaginationProps } from "_libraries/fetch/response";

import type { SampleSearchRequestType } from "../types";

export const useSampleList = (
  params: SampleSearchRequestType & ApiPaginationProps,
) => {
  return useSuspenseQuery(queryKeys.sample.list(params));
};

export const useSampleDetail = () => {
  const queryClient = useQueryClient();

  return async (sampleId: string) => {
    return await queryClient.fetchQuery({
      ...queryKeys.sample.detail(sampleId),
    });
  };
};
