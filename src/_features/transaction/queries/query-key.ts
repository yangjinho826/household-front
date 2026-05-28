import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { ApiPaginationProps } from "_libraries/fetch/response";

import {
  GetTransactionCalendarApi,
  GetTransactionCalendarFullApi,
  GetTransactionDetailApi,
  GetTransactionFormOptionsApi,
  GetTransactionSearchApi,
} from "../api";
import type { TransactionSearchRequestType } from "../types";

export const transactions = createQueryKeys("transaction", {
  list: (params: TransactionSearchRequestType & Partial<ApiPaginationProps>) => ({
    queryKey: [params],
    queryFn: () => GetTransactionSearchApi(params),
  }),
  // 무한 스크롤 — queryFn 은 useInfiniteList 헬퍼에서 cursor 주입해서 호출
  // queryKey 만 등록해서 transaction._def invalidate 에 자동으로 잡히게 함
  infinite: (params: TransactionSearchRequestType & { pageSize: number }) => ({
    queryKey: [params],
  }),
  detail: (transactionId: string) => ({
    queryKey: [transactionId],
    queryFn: () => GetTransactionDetailApi(transactionId),
  }),
  calendar: (params: { year: number; month: number }) => ({
    queryKey: [params],
    queryFn: () => GetTransactionCalendarApi(params),
  }),
  calendarFull: (params: { year: number; month: number }) => ({
    queryKey: [params],
    queryFn: () => GetTransactionCalendarFullApi(params),
  }),
  formOptions: () => ({
    queryKey: ["form-options"],
    queryFn: () => GetTransactionFormOptionsApi(),
  }),
});
