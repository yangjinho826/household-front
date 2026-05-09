"use client";

import { useMemo } from "react";

import { useAccountContext } from "_features/account/context";
import type { AccountType } from "_features/account/types";
import { fmt } from "_utilities/fmt";
import { C } from "_styles/design-tokens";

const TYPE_COLORS: Record<AccountType, string> = {
  생활: C.blue,
  적립: C.green,
  투자: C.purple,
};

/**
 * 자산 페이지 — 타입별 자산 분포 (생활/적립/투자).
 */
export function AssetDistribution() {
  const { accounts } = useAccountContext();
  const total = accounts.reduce((s, a) => s + a.balance, 0);

  const byType = useMemo(() => {
    const types: AccountType[] = ["생활", "적립", "투자"];
    return types.map((type) => {
      const accs = accounts.filter((a) => a.type === type);
      const sum = accs.reduce((s, a) => s + a.balance, 0);
      return {
        type,
        sum,
        accs,
        color: TYPE_COLORS[type],
        pct: total ? (sum / total) * 100 : 0,
      };
    });
  }, [accounts, total]);

  return (
    <div className="px-4 pt-4">
      <div className="bg-white rounded-2xl p-5">
        <h2 className="text-sm font-bold mb-3" style={{ color: C.text }}>
          자산 분포
        </h2>
        <div className="space-y-3">
          {byType.map((t) => (
            <div key={t.type}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: t.color }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: C.text }}
                  >
                    {t.type}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: C.textMuted }}
                  >
                    {t.pct.toFixed(0)}%
                  </span>
                </div>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: C.text }}
                >
                  {fmt(t.sum)}원
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: C.bg }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${t.pct}%`, background: t.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
