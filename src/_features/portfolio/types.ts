export interface PortfolioSearchRequestType {
  searchTerm?: string;
  accountId?: string;
  isArchived?: boolean;
}

/** 종목 등록 — 메타만 (qty=0). 매수는 buy 별도 호출 */
export interface PortfolioCreateRequest {
  ticker: string;
  symbol?: string | null;
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
  ticker?: string | null;
  symbol?: string | null;
  isArchived?: boolean | null;
}

export interface PortfolioListItemType {
  rowNo: number;
  portfolioId: string;
  accountId: string;
  accountName: string;
  ticker: string;
  symbol: string | null;
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
  ticker: string;
  symbol: string | null;
  ptType: PortfolioTxType;
  quantity: number;
  price: number;
  total: number;
  txDate: string;
  memo: string | null;
}
