export type Market =
  | "KRX_KOSPI"
  | "KRX_KOSDAQ"
  | "NASDAQ"
  | "NYSE"
  | "OTHER";

/** 자산군 배분 슬라이스 축 — 배분 파이/추이 group by 키.
 *  종목은 전부 INVESTMENT, 실물·부동산·연금은 수동자산이 차지. */
export type AssetClass =
  | "INVESTMENT"
  | "COMMODITY"
  | "CASH"
  | "REAL_ESTATE"
  | "PENSION"
  | "SAVINGS"
  | "OTHER";

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
  /** 매수 수수료 — 매수원가에 가산돼 평단이 올라간다 */
  fee?: number;
  txDate?: string;
  memo?: string | null;
}

/** 매도 요청 (부분/전량) */
export interface PortfolioSellRequest {
  portfolioId: string;
  quantity: number;
  sellPrice: number;
  /** 매도 수수료 — 실현손익에서 차감된다 */
  fee?: number;
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

/** 수동 시세 갱신 결과 */
export interface PortfolioRefreshResponse {
  fetched: number;
  skipped: number;
  updatedRows: number;
}

export interface PortfolioListItemType {
  portfolioId: string;
  accountId: string;
  accountName: string;
  name: string;
  code: string;
  market: Market;
  quantity: number;
  // KRW — 합산·순자산의 기준
  avgPrice: number;
  currentPrice: number;
  cost: number;
  /** = quantity * currentPrice (백엔드 derived) */
  currentValue: number;
  profitLoss: number;
  profitLossRate: number;
  // 거래통화 — 화면 주 표기와 환율 제외 수익률.
  // null 이면 원본 달러가를 모르는 과거 데이터 → KRW 단독 표시로 폴백한다.
  currency: string;
  avgPriceCcy: number | null;
  currentPriceCcy: number | null;
  profitLossCcy: number | null;
  profitLossRateCcy: number | null;
  isArchived: boolean;
  // 호환 필드 (mock — 향후 제거 가능)
  householdId?: string;
}

export type PortfolioDetailItemType = PortfolioListItemType;

/** 매수/매도 거래 이력 (백엔드 portfolio_transactions) */
export type PortfolioTxType = "BUY" | "SELL";

export interface PortfolioTransactionItemType {
  txId: string;
  accountId: string;
  accountName: string;
  name: string;
  code: string;
  market: Market;
  ptType: PortfolioTxType;
  quantity: number;
  price: number;
  /** 거래금액 (gross) = 수량 × 단가 */
  total: number;
  fee: number;
  /** 정산금액 (net) — 매수는 금액+수수료 출금, 매도는 금액−수수료 입금 */
  settlementAmount: number;
  txDate: string;
  memo: string | null;
  /** 매도 실현손익 — SELL 만 값, BUY/미집계는 null */
  realizedPnl: number | null;
  // 거래통화 — priceCcy 가 있으면 이 거래는 거래통화로 기록됐다는 뜻이고,
  // 수정 입력도 같은 단위여야 한다(백엔드 update 가 같은 필드로 판정).
  currency: string;
  priceCcy: number | null;
  feeCcy: number | null;
  /** 거래 시점에 박제된 환율 — 수정 시 이 값으로 원화를 파생한다 */
  fxRate: number | null;
}

/** 매매손익 — 매도 1건 (증권사 '매매손익' 테이블 행) */
export interface RealizedPnlRowType {
  txId: string;
  txDate: string;
  /** 카드 탭 → 수정 시트에서 어떤 종목인지 특정하는 데 필요 */
  portfolioItemId: string | null;
  name?: string | null; // 계좌 단위 응답에서 종목명 (종목 단위 응답은 없음)
  code: string;
  market: Market;
  memo: string | null;
  quantity: number;
  sellPrice: number;
  /** 거래금액 (gross) = 수량 × 단가 */
  amount: number;
  fee: number;
  /** 정산금액 = 거래금액 − 수수료 */
  settlement: number;
  realizedPnl: number;
  realizedRate: number;
  // 거래통화 기준 — 원화 손익률에는 환차손익이 섞인다.
  // 레거시 매도(원본 달러가 없음)는 전부 null → KRW 단독 표시로 폴백.
  currency: string;
  sellPriceCcy: number | null;
  amountCcy: number | null;
  feeCcy: number | null;
  settlementCcy: number | null;
  realizedPnlCcy: number | null;
  realizedRateCcy: number | null;
}

/** 매매손익 요약 — 기간 내 매도 전체 합산 */
export interface RealizedPnlSummaryType {
  totalRealized: number;
  totalRate: number;
  sellAmount: number;
  buyAmount: number;
  /** 제비용 — sellAmount/buyAmount 는 gross, totalRealized 는 net 이라 그 차이를 드러낸다 */
  totalFee: number;
}

/** 종목 매매손익 응답 */
export interface RealizedPnlResponseType {
  summary: RealizedPnlSummaryType;
  rows: RealizedPnlRowType[];
  // 실제 적용된 조회 기간 — from 미전송 시 백엔드가 첫 매도일까지 확장한 값.
  // 프론트는 이 값으로 날짜 입력을 채운다.
  effectiveFrom: string;
  effectiveTo: string;
}

/** 매수/매도 거래 수정 — pt_type 변경 불가 (백엔드 제약) */
export interface PortfolioTxUpdateRequest {
  txId: string;
  quantity?: number | null;
  price?: number | null;
  fee?: number | null;
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
  fromDate?: string;
  toDate?: string;
}

export interface PortfolioValueHistoryByItemRequest {
  portfolioItemId: string;
  fromDate?: string;
  toDate?: string;
}

// =========================================================
// Page-level overview / form-options 응답 타입
// =========================================================

import type { AccountListItemType } from "_features/account/types";

export interface PortfolioOverviewSummary {
  totalBalance: number;
  totalCash: number;
  totalValuation: number;
  totalCost: number;
  totalProfit: number;
  totalRate: number;
}

export interface InvestmentAccountWithPortfolios {
  account: AccountListItemType;
  portfolios: PortfolioListItemType[];
}

export interface PortfolioOverviewResponse {
  summary: PortfolioOverviewSummary;
  investmentAccounts: InvestmentAccountWithPortfolios[];
}

export interface AccountOverviewResponse {
  account: AccountListItemType;
  portfolios: PortfolioListItemType[];
}

export interface PortfolioFormOptionsResponse {
  investmentAccounts: AccountListItemType[];
}

/** 종목 단건 거래 내역 무한 스크롤 요청 */
export interface PortfolioItemTxSearchRequest {
  itemId: string;
}
