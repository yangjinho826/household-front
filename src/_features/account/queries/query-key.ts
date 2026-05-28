import { createQueryKeys } from "@lukemorales/query-key-factory";

import { GetAccountDetailApi, GetAccountSearchApi } from "../api";
import type { AccountSearchRequestType } from "../types";

export const accounts = createQueryKeys("account", {
  // 단일 페이지 fetch (필터/검색 컨텍스트 그대로 사용 — settings 등 카운트 표시에도 활용)
  list: (params: AccountSearchRequestType & { limit?: number }) => ({
    queryKey: [params],
    queryFn: () => GetAccountSearchApi(params),
  }),
  // 무한 스크롤 — queryFn 은 useInfiniteQuery 헬퍼에서 cursor 주입
  infinite: (params: AccountSearchRequestType & { pageSize: number }) => ({
    queryKey: [params],
  }),
  detail: (accountId: string) => ({
    queryKey: [accountId],
    queryFn: () => GetAccountDetailApi(accountId),
  }),
});
