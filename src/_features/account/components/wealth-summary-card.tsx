"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";

import { useAccountContext } from "_features/account/context";
import { fmt } from "_utilities/fmt";
import { C } from "_styles/design-tokens";

/**
 * 자산 페이지 — 총자산 hero + 6개월 트렌드 차트.
 */
export function WealthSummaryCard() {
  const { accounts } = useAccountContext();
  const total = accounts.reduce((s, a) => s + a.balance, 0);

  const trendData = useMemo(() => {
    const months = ["12월", "1월", "2월", "3월", "4월", "5월"];
    return months.map((m, i) => ({
      month: m,
      value: Math.round(total * (0.85 + i * 0.03)),
    }));
  }, [total]);

  return (
    <div className="px-4 pt-4">
      <div className="bg-white rounded-3xl p-6">
        <p className="text-xs font-medium mb-2" style={{ color: C.textMuted }}>
          총 자산
        </p>
        <p
          className="text-3xl font-extrabold tabular-nums mb-4"
          style={{ color: C.text }}
        >
          {fmt(total)}원
        </p>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="trendG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.blue} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={C.blue}
                strokeWidth={2.5}
                fill="url(#trendG)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: C.textMuted }}
                axisLine={false}
                tickLine={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
