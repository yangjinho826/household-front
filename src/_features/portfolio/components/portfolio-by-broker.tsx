"use client";

import { useMemo } from "react";

import { usePortfolioContext } from "_features/portfolio/context";
import type { PortfolioItem } from "_features/portfolio/types";
import { fmt } from "_utilities/fmt";
import { C } from "_styles/design-tokens";

type BrokerGroup = {
  broker: string;
  items: PortfolioItem[];
  sum: number;
};

/**
 * 포트폴리오 페이지 — 보유처별 그룹.
 */
export function PortfolioByBroker() {
  const { portfolio } = usePortfolioContext();

  const byBroker = useMemo(() => {
    const map = new Map<string, BrokerGroup>();
    portfolio.forEach((p) => {
      const existing = map.get(p.broker);
      if (existing) {
        existing.items.push(p);
        existing.sum += p.currentValue;
      } else {
        map.set(p.broker, { broker: p.broker, items: [p], sum: p.currentValue });
      }
    });
    return Array.from(map.values());
  }, [portfolio]);

  return (
    <div className="px-4 pt-4">
      <h2 className="text-sm font-bold mb-2" style={{ color: C.text }}>
        보유처별
      </h2>
      <div className="space-y-2">
        {byBroker.map((b) => (
          <div key={b.broker} className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold" style={{ color: C.text }}>
                {b.broker}
              </span>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: C.text }}
              >
                {fmt(b.sum)}원
              </span>
            </div>
            <p className="text-xs font-medium" style={{ color: C.textMuted }}>
              {b.items.length}개 종목
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
