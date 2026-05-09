import { createQueryKeys } from "@lukemorales/query-key-factory";
import { ApiPaginationProps } from "_libraries/fetch/response";
import { GetSampleDetailApi, GetSampleSearchApi } from "../api";
import { SampleSearchRequestType } from "../types";

export const samples = createQueryKeys("sample", {
  list: (params: SampleSearchRequestType & ApiPaginationProps) => ({
    queryKey: [params],
    queryFn: () => GetSampleSearchApi(params),
  }),
  detail: (sampleId: string) => ({
    queryKey: [sampleId],
    queryFn: () => GetSampleDetailApi(sampleId),
  }),
});
