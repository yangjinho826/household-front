import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";

import type {
  Market,
  PortfolioBuyRequest,
  PortfolioCreateRequest,
  PortfolioListItemType,
  PortfolioLookupResponse,
  PortfolioSearchRequestType,
  PortfolioSellRequest,
  PortfolioTransactionItemType,
  PortfolioTxUpdateRequest,
  PortfolioUpdateRequest,
  PortfolioValueHistoryByAccountRequest,
  PortfolioValueHistoryByItem,
  PortfolioValueHistoryByItemRequest,
} from "./types";

// 백엔드는 `id`(PK) + `valuation`(평가액). 프론트는 `portfolioId` + `currentValue`.
type BackendPortfolioResponse = Omit<
  PortfolioListItemType,
  "rowNo" | "portfolioId" | "currentValue" | "householdId"
> & {
  id: string;
  valuation: number;
};

type BackendPortfolioTxResponse = Omit<
  PortfolioTransactionItemType,
  "rowNo" | "txId"
> & { id: string };

function toListItem(
  b: BackendPortfolioResponse,
  rowNo: number,
): PortfolioListItemType {
  const { id, valuation, ...rest } = b;
  return { ...rest, portfolioId: id, currentValue: valuation, rowNo };
}

function toTx(
  b: BackendPortfolioTxResponse,
  rowNo: number,
): PortfolioTransactionItemType {
  const { id, ...rest } = b;
  return { ...rest, txId: id, rowNo };
}

export async function GetPortfolioSearchApi(
  params: PortfolioSearchRequestType,
) {
  const queryParams: Record<string, unknown> = {};
  if (params.accountId) queryParams.accountId = params.accountId;
  const queryString = objectToParams(queryParams).toString();
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse[]>>(
    `/api/portfolio/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map((b, idx) => toListItem(b, idx + 1));
  const wrapped: ApiListResponse<PortfolioListItemType> = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      listSize: items.length,
      currentPage: 1,
      currentCount: items.length,
      totalElements: items.length,
      totalPages: 1,
      content: items,
    },
  };
  return { ...res, body: wrapped };
}

export async function GetPortfolioDetailApi(portfolioId: string) {
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse>>(
    `/api/portfolio/detail/${portfolioId}`,
    { method: "GET" },
  );
  return { ...res, body: { ...res.body, data: toListItem(res.body.data, 1) } };
}

/** 종목 등록 — 메타만 (qty=0 시작) */
export async function PostPortfolioCreateApi(params: PortfolioCreateRequest) {
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse>>(
    `/api/portfolio/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
  );
  return { ...res, body: { ...res.body, data: toListItem(res.body.data, 1) } };
}

/** 야후 파이낸스 종목 조회 — 폼 자동 채움용 (저장 X) */
export async function GetPortfolioLookupApi(market: Market, code: string) {
  const params = new URLSearchParams({ market, code });
  return apiFetch<ApiResponse<PortfolioLookupResponse>>(
    `/api/portfolio/lookup?${params.toString()}`,
    { method: "GET", errorHandleMethod: "reject" },
  );
}

/** 매수 액션 — 기존 종목에 qty 누적 + avg_price 재계산 + 이력 기록 */
export async function PostPortfolioBuyApi(params: PortfolioBuyRequest) {
  const { portfolioId, ...body } = params;
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse>>(
    `/api/portfolio/buy/${portfolioId}`,
    { method: "POST", body, errorHandleMethod: "reject" },
  );
  return { ...res, body: { ...res.body, data: toListItem(res.body.data, 1) } };
}

/** 매도 (부분/전량) */
export async function PostPortfolioSellApi(params: PortfolioSellRequest) {
  const { portfolioId, ...body } = params;
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse | null>>(
    `/api/portfolio/sell/${portfolioId}`,
    { method: "POST", body, errorHandleMethod: "reject" },
  );
  const data = res.body.data ? toListItem(res.body.data, 1) : null;
  return { ...res, body: { ...res.body, data } };
}

/** 평가액/메타 수정 (transaction 무관) */
export async function PutPortfolioUpdateApi(params: PortfolioUpdateRequest) {
  const { portfolioId, ...body } = params;
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse>>(
    `/api/portfolio/update/${portfolioId}`,
    { method: "PUT", body, errorHandleMethod: "reject" },
  );
  return { ...res, body: { ...res.body, data: toListItem(res.body.data, 1) } };
}

// =========================================================
// Value History — 차트용 월별 평가액 추이
// =========================================================

/** 통장 단위 — 종목별 월별 평가액 추이 (기본: 최근 12개월) */
export async function GetPortfolioValueHistoryByAccountApi(
  params: PortfolioValueHistoryByAccountRequest,
) {
  const queryParams: Record<string, unknown> = { accountId: params.accountId };
  if (params.from) queryParams.from = params.from;
  if (params.to) queryParams.to = params.to;
  const queryString = objectToParams(queryParams).toString();
  return apiFetch<ApiResponse<PortfolioValueHistoryByItem[]>>(
    `/api/portfolio/value-history?${queryString}`,
    { method: "GET" },
  );
}

/** 특정 종목 — 월별 평가액 추이 (기본: 최근 12개월) */
export async function GetPortfolioValueHistoryByItemApi(
  params: PortfolioValueHistoryByItemRequest,
) {
  const queryParams: Record<string, unknown> = {};
  if (params.from) queryParams.from = params.from;
  if (params.to) queryParams.to = params.to;
  const queryString = objectToParams(queryParams).toString();
  return apiFetch<ApiResponse<PortfolioValueHistoryByItem>>(
    `/api/portfolio/${params.portfolioItemId}/value-history${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
}

/** 매수/매도 거래 수정 (pt_type 불변) */
export async function PutPortfolioTxUpdateApi(
  params: PortfolioTxUpdateRequest,
) {
  const { txId, ...body } = params;
  const res = await apiFetch<ApiResponse<BackendPortfolioTxResponse>>(
    `/api/portfolio/transactions/${txId}`,
    { method: "PUT", body, errorHandleMethod: "reject" },
  );
  return { ...res, body: { ...res.body, data: toTx(res.body.data, 1) } };
}

/** 매수/매도 거래 soft delete — 해당 종목 quantity/avg_price 자동 재계산 */
export async function DeletePortfolioTxApi(txId: string) {
  return apiFetch<ApiResponse<null>>(
    `/api/portfolio/transactions/${txId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}

/** 매수/매도 거래 이력 */
export async function GetPortfolioTransactionsApi(params: {
  accountId?: string;
}) {
  const queryParams: Record<string, unknown> = {};
  if (params.accountId) queryParams.accountId = params.accountId;
  const queryString = objectToParams(queryParams).toString();
  const res = await apiFetch<ApiResponse<BackendPortfolioTxResponse[]>>(
    `/api/portfolio/transactions${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map((b, idx) => toTx(b, idx + 1));
  const wrapped: ApiListResponse<PortfolioTransactionItemType> = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      listSize: items.length,
      currentPage: 1,
      currentCount: items.length,
      totalElements: items.length,
      totalPages: 1,
      content: items,
    },
  };
  return { ...res, body: wrapped };
}
