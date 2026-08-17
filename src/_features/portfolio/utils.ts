import { PORTFOLIO_PALETTE } from "_styles/design-tokens";

import type {
  PortfolioDetailItemType,
  PortfolioListItemType,
} from "./types";

/**
 * 종목명에 팔레트 색 하나를 안정적으로 매핑.
 * 같은 종목명은 항상 같은 색 (hash mod).
 */
export function pickPortfolioColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % PORTFOLIO_PALETTE.length;
  return PORTFOLIO_PALETTE[idx]!;
}

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
  if (profit > 0) return "danger.5";
  if (profit < 0) return "info.5";
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

/**
 * 거래통화 금액 표기 — "$230.38".
 *
 * 소수 2자리 고정. 달러 단가는 원화와 달리 센트가 유의미하다.
 */
export function formatCcy(amount: number | string, currency: string): string {
  // 백엔드가 Decimal 을 JSON 문자열로 내린다. String.prototype.toLocaleString 은
  // 문자열을 그대로 돌려주므로("230.3823") 반드시 숫자로 강제해야 자릿수가 맞는다.
  const n = Number(amount);
  if (currency === "USD") {
    return `$${n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return n.toLocaleString("ko-KR");
}

/**
 * 토스증권식 이중 표기를 쓸지 판정. (훅 아님 — 순수 함수라 use 접두사를 쓰지 않는다)
 *
 * 거래통화가 원화가 아니고 **원본 값이 있을 때만** true. 마이그레이션 이전 거래는
 * 원본 달러가가 저장된 적이 없어(당시 환율도 없음) null 이고, 그때는 억지로
 * 환산해 보여주는 대신 원화 단독으로 폴백한다.
 */
export function isDualCurrency(
  currency: string,
  ...values: (number | null | undefined)[]
): boolean {
  return currency !== "KRW" && values.every((v) => v !== null && v !== undefined);
}
