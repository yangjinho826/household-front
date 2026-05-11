import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";

import type {
  PortfolioBuyRequest,
  PortfolioCreateRequest,
  PortfolioListItemType,
  PortfolioSearchRequestType,
  PortfolioSellRequest,
  PortfolioTransactionItemType,
  PortfolioTxType,
  PortfolioUpdateRequest,
  PortfolioValueHistoryByAccountRequest,
  PortfolioValueHistoryByItem,
  PortfolioValueHistoryByItemRequest,
  PortfolioValueHistoryPoint,
} from "./types";

const num = (v: number | string) => (typeof v === "number" ? v : Number(v));

interface BackendPortfolioResponse {
  id: string;
  account_id: string;
  account_name: string;
  ticker: string;
  symbol: string | null;
  quantity: number | string;
  avg_price: number | string;
  current_price: number | string;
  cost: number | string;
  valuation: number | string;
  profit_loss: number | string;
  profit_loss_rate: number | string;
  is_archived: boolean;
}

interface BackendPortfolioTxResponse {
  id: string;
  account_id: string;
  account_name: string;
  ticker: string;
  symbol: string | null;
  pt_type: PortfolioTxType;
  quantity: number | string;
  price: number | string;
  total: number | string;
  tx_date: string;
  memo: string | null;
}

function mapToItem(b: BackendPortfolioResponse, rowNo: number): PortfolioListItemType {
  return {
    rowNo,
    portfolioId: b.id,
    accountId: b.account_id,
    accountName: b.account_name,
    ticker: b.ticker,
    symbol: b.symbol,
    quantity: num(b.quantity),
    avgPrice: num(b.avg_price),
    currentPrice: num(b.current_price),
    cost: num(b.cost),
    currentValue: num(b.valuation),
    profitLoss: num(b.profit_loss),
    profitLossRate: num(b.profit_loss_rate),
    isArchived: b.is_archived,
    frstRegDt: "",
    lastMdfcnDt: "",
    dataStatCd: "ACTIVE",
  };
}

function mapToTx(b: BackendPortfolioTxResponse, rowNo: number): PortfolioTransactionItemType {
  return {
    rowNo,
    txId: b.id,
    accountId: b.account_id,
    accountName: b.account_name,
    ticker: b.ticker,
    symbol: b.symbol,
    ptType: b.pt_type,
    quantity: num(b.quantity),
    price: num(b.price),
    total: num(b.total),
    txDate: b.tx_date,
    memo: b.memo,
  };
}

export async function GetPortfolioSearchApi(params: PortfolioSearchRequestType) {
  const queryParams: Record<string, unknown> = {};
  if (params.accountId) queryParams.accountId = params.accountId;

  const queryString = objectToParams(queryParams).toString();
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse[]>>(
    `/api/portfolio/list${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map((b, idx) => mapToItem(b, idx + 1));
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
  return {
    ...res,
    body: { ...res.body, data: mapToItem(res.body.data, 1) },
  };
}

/** 종목 등록 — 메타만 (qty=0 시작) */
export async function PostPortfolioCreateApi(params: PortfolioCreateRequest) {
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse>>(
    `/api/portfolio/create`,
    {
      method: "POST",
      body: {
        ticker: params.ticker,
        symbol: params.symbol ?? null,
        current_price: params.currentPrice,
        account_id: params.accountId,
      },
      errorHandleMethod: "reject",
    },
  );
  return { ...res, body: { ...res.body, data: mapToItem(res.body.data, 1) } };
}

/** 매수 액션 — 기존 종목에 qty 누적 + avg_price 재계산 + 이력 기록 */
export async function PostPortfolioBuyApi(params: PortfolioBuyRequest) {
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse>>(
    `/api/portfolio/buy/${params.portfolioId}`,
    {
      method: "POST",
      body: {
        quantity: params.quantity,
        price: params.price,
        tx_date: params.txDate ?? null,
        memo: params.memo ?? null,
      },
      errorHandleMethod: "reject",
    },
  );
  return { ...res, body: { ...res.body, data: mapToItem(res.body.data, 1) } };
}

/** 매도 (부분/전량) */
export async function PostPortfolioSellApi(params: PortfolioSellRequest) {
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse | null>>(
    `/api/portfolio/sell/${params.portfolioId}`,
    {
      method: "POST",
      body: {
        quantity: params.quantity,
        sell_price: params.sellPrice,
        tx_date: params.txDate ?? null,
        memo: params.memo ?? null,
      },
      errorHandleMethod: "reject",
    },
  );
  const data = res.body.data ? mapToItem(res.body.data, 1) : null;
  return { ...res, body: { ...res.body, data } };
}

/** 평가액/메타 수정 (transaction 무관) */
export async function PutPortfolioUpdateApi(params: PortfolioUpdateRequest) {
  const res = await apiFetch<ApiResponse<BackendPortfolioResponse>>(
    `/api/portfolio/update/${params.portfolioId}`,
    {
      method: "PUT",
      body: {
        current_price: params.currentPrice ?? null,
        ticker: params.ticker ?? null,
        symbol: params.symbol ?? null,
        is_archived: params.isArchived ?? null,
      },
      errorHandleMethod: "reject",
    },
  );
  return { ...res, body: { ...res.body, data: mapToItem(res.body.data, 1) } };
}

// =========================================================
// Value History — 차트용 월별 평가액 추이
// =========================================================

interface BackendValueHistoryPoint {
  snapshot_date: string;
  quantity: number | string;
  avg_price: number | string;
  current_price: number | string;
  cost: number | string;
  valuation: number | string;
}

interface BackendValueHistoryByItem {
  portfolio_item_id: string;
  account_id: string;
  ticker: string;
  symbol: string | null;
  history: BackendValueHistoryPoint[];
}

function mapHistoryPoint(b: BackendValueHistoryPoint): PortfolioValueHistoryPoint {
  return {
    snapshotDate: b.snapshot_date,
    quantity: num(b.quantity),
    avgPrice: num(b.avg_price),
    currentPrice: num(b.current_price),
    cost: num(b.cost),
    valuation: num(b.valuation),
  };
}

function mapHistoryByItem(b: BackendValueHistoryByItem): PortfolioValueHistoryByItem {
  return {
    portfolioItemId: b.portfolio_item_id,
    accountId: b.account_id,
    ticker: b.ticker,
    symbol: b.symbol,
    history: b.history.map(mapHistoryPoint),
  };
}

/** 통장 단위 — 종목별 월별 평가액 추이 (기본: 최근 12개월) */
export async function GetPortfolioValueHistoryByAccountApi(
  params: PortfolioValueHistoryByAccountRequest,
) {
  const queryParams: Record<string, unknown> = { accountId: params.accountId };
  if (params.from) queryParams.from = params.from;
  if (params.to) queryParams.to = params.to;
  const queryString = objectToParams(queryParams).toString();
  const res = await apiFetch<ApiResponse<BackendValueHistoryByItem[]>>(
    `/api/portfolio/value-history?${queryString}`,
    { method: "GET" },
  );
  return {
    ...res,
    body: {
      ...res.body,
      data: (res.body.data ?? []).map(mapHistoryByItem),
    },
  };
}

/** 특정 종목 — 월별 평가액 추이 (기본: 최근 12개월) */
export async function GetPortfolioValueHistoryByItemApi(
  params: PortfolioValueHistoryByItemRequest,
) {
  const queryParams: Record<string, unknown> = {};
  if (params.from) queryParams.from = params.from;
  if (params.to) queryParams.to = params.to;
  const queryString = objectToParams(queryParams).toString();
  const res = await apiFetch<ApiResponse<BackendValueHistoryByItem>>(
    `/api/portfolio/${params.portfolioItemId}/value-history${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  return {
    ...res,
    body: { ...res.body, data: mapHistoryByItem(res.body.data) },
  };
}

/** 매수/매도 거래 이력 */
export async function GetPortfolioTransactionsApi(params: { accountId?: string }) {
  const queryParams: Record<string, unknown> = {};
  if (params.accountId) queryParams.accountId = params.accountId;
  const queryString = objectToParams(queryParams).toString();
  const res = await apiFetch<ApiResponse<BackendPortfolioTxResponse[]>>(
    `/api/portfolio/transactions${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
  const items = (res.body.data ?? []).map((b, idx) => mapToTx(b, idx + 1));
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
