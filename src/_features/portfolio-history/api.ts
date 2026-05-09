import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type { ApiListResponse } from "_libraries/fetch/response";
import { mockOkList } from "_utilities/mock-response";

import { portfolioHistoryMockStore } from "./mock";
import type {
  PortfolioHistoryItemType,
  PortfolioHistorySearchRequestType,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const wrap = <T>(data: T) => ({ body: data });

export function GetPortfolioHistorySearchApi(
  params: PortfolioHistorySearchRequestType,
) {
  if (USE_MOCK) {
    const items = portfolioHistoryMockStore.list({
      portfolioItemId: params.portfolioItemId,
    });
    return Promise.resolve(wrap(mockOkList(items)));
  }
  const queryString = objectToParams({ ...params }).toString();
  return apiFetch<ApiListResponse<PortfolioHistoryItemType>>(
    `/api/front/v1/portfolio-history/list?${queryString}`,
    { method: "GET" },
  );
}
