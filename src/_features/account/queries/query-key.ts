import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetAccountDetailApi, GetAccountReportApi } from "../api";
import type { AccountSearchRequestType } from "../types";

export const accounts = createQueryKeys("account", {
  // 무한 스크롤 — queryFn 은 useInfiniteQuery 헬퍼에서 cursor 주입
  infinite: (params: AccountSearchRequestType & { pageSize: number }) => ({
    queryKey: [params],
  }),
  detail: (accountId: string) => ({
    queryKey: [accountId],
    queryFn: () => GetAccountDetailApi(accountId),
  }),
  report: (accountId: string) => ({
    queryKey: [accountId],
    queryFn: () => GetAccountReportApi(accountId),
  }),
});
