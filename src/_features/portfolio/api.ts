import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { mockOkItem, mockOkList } from "_utilities/mock-response";

import { portfolioMockStore } from "./mock";
import type {
  PortfolioCreateRequest,
  PortfolioDetailItemType,
  PortfolioListItemType,
  PortfolioSearchRequestType,
  PortfolioUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const wrap = <T>(data: T) => ({ body: data });

export function GetPortfolioSearchApi(params: PortfolioSearchRequestType) {
  if (USE_MOCK) {
    const items = portfolioMockStore.list();
    const filtered = items.filter((i) => {
      if (
        params.searchTerm &&
        !`${i.ticker} ${i.symbol ?? ""}`
          .toLowerCase()
          .includes(params.searchTerm.toLowerCase())
      )
        return false;
      if (params.isArchived !== undefined && i.isArchived !== params.isArchived)
        return false;
      return true;
    });
    return Promise.resolve(wrap(mockOkList(filtered)));
  }
  const queryString = objectToParams({ ...params }).toString();
  return apiFetch<ApiListResponse<PortfolioListItemType>>(
    `/api/front/v1/portfolio/list?${queryString}`,
    { method: "GET" },
  );
}

export function GetPortfolioDetailApi(portfolioId: string) {
  if (USE_MOCK) {
    const item = portfolioMockStore.detail(portfolioId);
    if (!item) return Promise.reject(new Error("portfolio not found"));
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<PortfolioDetailItemType>>(
    `/api/front/v1/portfolio/detail/${portfolioId}`,
    { method: "GET", errorHandleMethod: "reject" },
  );
}

export function PostPortfolioCreateApi(params: PortfolioCreateRequest) {
  if (USE_MOCK) {
    const item = portfolioMockStore.create({
      householdId: params.householdId,
      accountId: params.accountId,
      ticker: params.ticker,
      symbol: params.symbol ?? null,
      quantity: params.quantity,
      avgPrice: params.avgPrice,
      currentValue: params.currentValue,
      isArchived: params.isArchived,
    });
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<PortfolioDetailItemType>>(
    `/api/front/v1/portfolio/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
  );
}

export function PutPortfolioUpdateApi(params: PortfolioUpdateRequest) {
  if (USE_MOCK) {
    const { portfolioId, ...rest } = params;
    portfolioMockStore.update(portfolioId, {
      ...rest,
      symbol: rest.symbol ?? null,
    });
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/portfolio/update/${params.portfolioId}`,
    { method: "PUT", body: params, errorHandleMethod: "reject" },
  );
}

export function DeletePortfolioDeleteApi(portfolioId: string) {
  if (USE_MOCK) {
    portfolioMockStore.remove(portfolioId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/portfolio/delete/${portfolioId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
