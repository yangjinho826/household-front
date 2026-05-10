import type {
  PortfolioDetailItemType,
  PortfolioListItemType,
} from "./types";

export interface PortfolioStat {
  totalValue: number;
  totalCost: number;
  profit: number;
  profitRate: number;
}

type AnyPortfolio = PortfolioListItemType | PortfolioDetailItemType;

/**
 * 포트폴리오 (계좌/종목 단위) 평가 합산.
 * - totalValue: 평가금액 합 (currentValue)
 * - totalCost: 매입금 합 (quantity * avgPrice)
 * - profit: 평가손익 = totalValue - totalCost
 * - profitRate: 손익률 (%) = profit / totalCost * 100
 */
export function portfolioCalc(items: AnyPortfolio[]): PortfolioStat {
  const totalValue = items.reduce((s, p) => s + p.currentValue, 0);
  const totalCost = items.reduce((s, p) => s + p.quantity * p.avgPrice, 0);
  const profit = totalValue - totalCost;
  const profitRate = totalCost > 0 ? (profit / totalCost) * 100 : 0;
  return { totalValue, totalCost, profit, profitRate };
}

/** 한국 주식 표기 — 양수 빨강(상승), 음수 파랑(하락), 0 회색 */
export function profitColor(profit: number): string {
  if (profit > 0) return "tossRed.5";
  if (profit < 0) return "tossBlue.5";
  return "gray.6";
}

/** "+1.49%" / "-5.10%" 포맷 */
export function formatProfitRate(rate: number): string {
  const sign = rate > 0 ? "+" : "";
  return `${sign}${rate.toFixed(2)}%`;
}

/** "+36,994" / "-63,244" — fmt 연동은 호출자에서 */
export function formatProfitAmount(amount: number, formatter: (n: number) => string): string {
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
  return `${sign}${formatter(Math.abs(amount))}`;
}
