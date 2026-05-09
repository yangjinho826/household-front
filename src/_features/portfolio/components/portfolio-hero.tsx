"use client";

import { usePortfolioContext } from "_features/portfolio/context";
import { fmt } from "_utilities/fmt";
import { C } from "_styles/design-tokens";

/**
 * 포트폴리오 페이지 — 그라디언트 hero 카드 (총 평가금액 + 손익 + 수익률).
 */
export function PortfolioHero() {
  const { portfolio } = usePortfolioContext();
  const total = portfolio.reduce((s, p) => s + p.currentValue, 0);
  const totalCost = portfolio.reduce((s, p) => s + p.quantity * p.avgPrice, 0);
  const profit = total - totalCost;
  const profitRate = totalCost ? (profit / totalCost) * 100 : 0;

  return (
    <div className="px-4 pt-4">
      <div
        className="rounded-3xl p-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${C.purple} 0%, #6D5DCB 100%)`,
        }}
      >
        <p className="text-xs font-medium mb-2 text-white/80">총 평가금액</p>
        <p className="text-3xl font-extrabold tabular-nums mb-4">
          {fmt(total)}원
        </p>
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="text-white/70 mb-0.5">평가손익</p>
            <p className="font-bold tabular-nums">
              {profit >= 0 ? "+" : ""}
              {fmt(profit)}원
            </p>
          </div>
          <div>
            <p className="text-white/70 mb-0.5">수익률</p>
            <p className="font-bold tabular-nums">
              {profit >= 0 ? "+" : ""}
              {profitRate.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
