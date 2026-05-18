export type Market = "KRX_KOSPI" | "KRX_KOSDAQ" | "NASDAQ" | "NYSE";

export interface PortfolioSearchRequestType {
  searchTerm?: string;
  accountId?: string;
  isArchived?: boolean;
}

/** 종목 등록 — 메타만 (qty=0). 매수는 buy 별도 호출 */
export interface PortfolioCreateRequest {
  name: string;
  code: string;
  market: Market;
  currentPrice: number;
  accountId: string;
}

/** 매수 액션 — 기존 종목에 qty 누적 + avg_price 재계산 + 이력 기록 */
export interface PortfolioBuyRequest {
  portfolioId: string;
  quantity: number;
  price: number;
  txDate?: string;
  memo?: string | null;
}

/** 매도 요청 (부분/전량) */
export interface PortfolioSellRequest {
  portfolioId: string;
  quantity: number;
  sellPrice: number;
  txDate?: string;
  memo?: string | null;
}

/** 평가액/메타 수정 (transaction 무관) */
export interface PortfolioUpdateRequest {
  portfolioId: string;
  currentPrice?: number | null;
  name?: string | null;
  code?: string | null;
  market?: Market | null;
  isArchived?: boolean | null;
}

/** 야후 파이낸스 조회 결과 (저장 전 미리보기용) */
export interface PortfolioLookupResponse {
  market: Market;
  code: string;
  name: string;
  currentPrice: number;
  yahooSymbol: string;
}

export interface PortfolioListItemType {
  rowNo: number;
  portfolioId: string;
  accountId: string;
  accountName: string;
  name: string;
  code: string;
  market: Market;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  cost: number;
  /** = quantity * currentPrice (백엔드 derived) */
  currentValue: number;
  profitLoss: number;
  profitLossRate: number;
  isArchived: boolean;
  // 호환 필드 (mock — 향후 제거 가능)
  householdId?: string;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}

export type PortfolioDetailItemType = PortfolioListItemType;

/** 매수/매도 거래 이력 (백엔드 portfolio_transactions) */
export type PortfolioTxType = "BUY" | "SELL";

export interface PortfolioTransactionItemType {
  rowNo: number;
  txId: string;
  accountId: string;
  accountName: string;
  name: string;
  code: string;
  market: Market;
  ptType: PortfolioTxType;
  quantity: number;
  price: number;
  total: number;
  txDate: string;
  memo: string | null;
}

/** 매수/매도 거래 수정 — pt_type 변경 불가 (백엔드 제약) */
export interface PortfolioTxUpdateRequest {
  txId: string;
  quantity?: number | null;
  price?: number | null;
  txDate?: string | null;
  memo?: string | null;
}

/** 월별 평가액 추이 1 point */
export interface PortfolioValueHistoryPoint {
  snapshotDate: string; // YYYY-MM-DD (월말)
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  cost: number;
  valuation: number;
}

/** 종목별 그루핑 — 차트 라인 1개 */
export interface PortfolioValueHistoryByItem {
  portfolioItemId: string;
  accountId: string;
  name: string;
  code: string;
  market: Market;
  history: PortfolioValueHistoryPoint[];
}

export interface PortfolioValueHistoryByAccountRequest {
  accountId: string;
  from?: string;
  to?: string;
}

export interface PortfolioValueHistoryByItemRequest {
  portfolioItemId: string;
  from?: string;
  to?: string;
}
