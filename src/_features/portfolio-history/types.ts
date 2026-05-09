export interface PortfolioHistorySearchRequestType {
  portfolioItemId?: string;
}

export interface PortfolioHistoryItemType {
  historyId: string;
  portfolioItemId: string;
  recordDate: string; // YYYY-MM-DD (월말)
  value: number;
  quantity: number | null;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}

// 차트용 — 월별 집계 결과
export interface PortfolioMonthlyAggregate {
  month: string; // YYYY-MM
  value: number; // 전체 평가액 합산
}
