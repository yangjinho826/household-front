"use client";

import { useMemo } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { useTransactionContext } from "_features/transaction/context";
import { fmt } from "_utilities/fmt";
import { C } from "_styles/design-tokens";

/**
 * 홈 화면 — 이번 달 수입/지출 그리드 + 저축/저축률.
 */
export function IncomeExpenseSummary() {
  const { transactions } = useTransactionContext();

  const stats = useMemo(() => {
    const monthTx = transactions.filter((t) => t.date.startsWith("2026-05"));
    const income = monthTx
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = monthTx
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return {
      income,
      expense,
      save: income - expense,
      savingRate: income ? ((income - expense) / income) * 100 : 0,
    };
  }, [transactions]);

  return (
    <div className="px-4 pt-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowDown
              className="w-3 h-3"
              style={{ color: C.blue }}
              strokeWidth={3}
            />
            <p className="text-xs font-medium" style={{ color: C.textMuted }}>
              수입
            </p>
          </div>
          <p
            className="text-lg font-bold tabular-nums"
            style={{ color: C.text }}
          >
            {fmt(stats.income)}
            <span className="text-xs ml-0.5 font-semibold">원</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowUp
              className="w-3 h-3"
              style={{ color: C.red }}
              strokeWidth={3}
            />
            <p className="text-xs font-medium" style={{ color: C.textMuted }}>
              지출
            </p>
          </div>
          <p
            className="text-lg font-bold tabular-nums"
            style={{ color: C.text }}
          >
            {fmt(stats.expense)}
            <span className="text-xs ml-0.5 font-semibold">원</span>
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 mt-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: C.textMuted }}>
              이번 달 저축
            </p>
            <p
              className="text-xl font-bold tabular-nums"
              style={{ color: C.text }}
            >
              {fmt(stats.save)}원
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium mb-1" style={{ color: C.textMuted }}>
              저축률
            </p>
            <p
              className="text-lg font-bold tabular-nums"
              style={{ color: C.blue }}
            >
              {stats.savingRate.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
