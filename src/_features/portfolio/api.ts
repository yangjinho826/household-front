import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiCursorPage,
  ApiResponse,
} from "_libraries/fetch/response";

import type {
  AccountOverviewResponse,
  InvestmentAccountWithPortfolios,
  Market,
  PortfolioBuyRequest,
  PortfolioCreateRequest,
  PortfolioFormOptionsResponse,
  PortfolioListItemType,
  PortfolioLookupResponse,
  PortfolioOverviewResponse,
  PortfolioSellRequest,
  PortfolioTransactionItemType,
  PortfolioTxUpdateRequest,
  PortfolioUpdateRequest,
  PortfolioValueHistoryByAccountRequest,
  PortfolioValueHistoryByItem,
  PortfolioValueHistoryByItemRequest,
  RealizedPnlResponseType,
} from "./types";
import type { AccountListItemType } from "_features/account/types";

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

type BackendAccountResponse = Omit<AccountListItemType, "accountId" | "rowNo"> & {
  id: string;
};

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

function toAccount(
  b: BackendAccountResponse,
  rowNo: number,
): AccountListItemType {
  const { id, ...rest } = b;
  return { ...rest, accountId: id, rowNo };
}

// =========================================================
// Page-level entry (페이지 진입 시 1호출)
// =========================================================

export async function GetPortfolioOverviewApi() {
  const res = await apiFetch<
    ApiResponse<{
      summary: PortfolioOverviewResponse["summary"];
      investmentAccounts: Array<{
        account: BackendAccountResponse;
        portfolios: BackendPortfolioResponse[];
      }>;
    }>
  >(`/api/portfolio/overview`, { method: "GET" });

  const investmentAccounts: InvestmentAccountWithPortfolios[] =
    res.body.data.investmentAccounts.map((g, gi) => ({
      account: toAccount(g.account, gi + 1),
      portfolios: g.portfolios.map((p, pi) => toListItem(p, pi + 1)),
    }));

  const mapped: PortfolioOverviewResponse = {
    summary: res.body.data.summary,
    investmentAccounts,
  };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function GetAccountOverviewApi(accountId: string) {
  const res = await apiFetch<
    ApiResponse<{
      account: BackendAccountResponse;
      portfolios: BackendPortfolioResponse[];
    }>
  >(`/api/portfolio/accounts/${accountId}/overview`, { method: "GET" });

  const mapped: AccountOverviewResponse = {
    account: toAccount(res.body.data.account, 1),
    portfolios: res.body.data.portfolios.map((p, i) => toListItem(p, i + 1)),
  };
  return { ...res, body: { ...res.body, data: mapped } };
}

export async function GetPortfolioFormOptionsApi() {
  const res = await apiFetch<
    ApiResponse<{ investmentAccounts: BackendAccountResponse[] }>
  >(`/api/portfolio/form-options`, { method: "GET" });

  const mapped: PortfolioFormOptionsResponse = {
    investmentAccounts: res.body.data.investmentAccounts.map((a, i) =>
      toAccount(a, i + 1),
    ),
  };
  return { ...res, body: { ...res.body, data: mapped } };
}

// =========================================================
// Item-level
// =========================================================

export async function GetPortfolioItemApi(itemId: string) {
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse>>(
    `/api/portfolio/items/${itemId}`,
    { method: "GET" },
  );
  return { ...res, body: { ...res.body, data: toListItem(res.body.data, 1) } };
}

export async function GetPortfolioItemTransactionsApi(
  itemId: string,
  cursor: string | null,
  limit: number,
) {
  const queryString = objectToParams({
    ...(cursor ? { cursor } : {}),
    limit,
  }).toString();
  const res = await apiFetch<
    ApiResponse<{
      items: BackendPortfolioTxResponse[];
      nextCursor: string | null;
      hasNext: boolean;
      totalCount: number | null;
    }>
  >(`/api/portfolio/items/${itemId}/transactions?${queryString}`, {
    method: "GET",
  });
  const items = res.body.data.items.map((b, i) => toTx(b, i + 1));
  const wrapped: ApiCursorPage<PortfolioTransactionItemType> = {
    code: res.body.code,
    message: res.body.message,
    status: res.body.status,
    data: {
      items,
      nextCursor: res.body.data.nextCursor,
      hasNext: res.body.data.hasNext,
      totalCount: res.body.data.totalCount,
    },
  };
  return { ...res, body: wrapped };
}

/** 종목 매매손익 — 기간 내 매도 건별 실현손익 + 요약 (기본 최근 12개월) */
export async function GetPortfolioItemRealizedPnlApi(
  itemId: string,
  fromDate?: string,
  toDate?: string,
) {
  const queryParams: Record<string, unknown> = {};
  if (fromDate) queryParams.fromDate = fromDate;
  if (toDate) queryParams.toDate = toDate;
  const queryString = objectToParams(queryParams).toString();
  return apiFetch<ApiResponse<RealizedPnlResponseType>>(
    `/api/portfolio/items/${itemId}/realized-pnl${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
}

// =========================================================
// Mutations + utility
// =========================================================

/** 종목 등록 — 메타만 (qty=0 시작) */
export async function PostPortfolioCreateApi(
  params: PortfolioCreateRequest,
  idempotencyKey?: string,
) {
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse>>(
    `/api/portfolio/create`,
    {
      method: "POST",
      body: params,
      idempotencyKey,
      errorHandleMethod: "reject",
    },
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
export async function PostPortfolioBuyApi(
  params: PortfolioBuyRequest,
  idempotencyKey?: string,
) {
  const { portfolioId, ...body } = params;
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse>>(
    `/api/portfolio/buy/${portfolioId}`,
    {
      method: "POST",
      body,
      idempotencyKey,
      errorHandleMethod: "reject",
    },
  );
  return { ...res, body: { ...res.body, data: toListItem(res.body.data, 1) } };
}

/** 매도 (부분/전량) */
export async function PostPortfolioSellApi(
  params: PortfolioSellRequest,
  idempotencyKey?: string,
) {
  const { portfolioId, ...body } = params;
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse | null>>(
    `/api/portfolio/sell/${portfolioId}`,
    {
      method: "POST",
      body,
      idempotencyKey,
      errorHandleMethod: "reject",
    },
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

// =========================================================
// Value history (차트)
// =========================================================

/** 통장 단위 — 종목별 월별 평가액 추이 (기본: 최근 12개월) */
export async function GetPortfolioValueHistoryByAccountApi(
  params: PortfolioValueHistoryByAccountRequest,
) {
  const queryParams: Record<string, unknown> = { accountId: params.accountId };
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;
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
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;
  const queryString = objectToParams(queryParams).toString();
  return apiFetch<ApiResponse<PortfolioValueHistoryByItem>>(
    `/api/portfolio/items/${params.portfolioItemId}/value-history${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
}
