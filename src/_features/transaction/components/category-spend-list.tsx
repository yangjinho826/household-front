"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";

import { useCategoryContext } from "_features/category/context";
import { useTransactionContext } from "_features/transaction/context";
import { fmt } from "_utilities/fmt";
import { getCategoryIcon } from "_utilities/icons";
import { C } from "_styles/design-tokens";

/**
 * 홈 화면 — 이번 달 카테고리별 지출 (상위 5개).
 */
export function CategorySpendList() {
  const params = useParams<{ locale: string }>();
  const { transactions } = useTransactionContext();
  const { categories } = useCategoryContext();

  const categorySpend = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense" && t.date.startsWith("2026-05"))
      .forEach((t) => {
        if (t.categoryId) {
          map[t.categoryId] = (map[t.categoryId] ?? 0) + t.amount;
        }
      });
    return Object.entries(map)
      .map(([cid, amount]) => {
        const cat = categories.find((c) => c.id === cid);
        return { ...cat, amount };
      })
      .filter((c): c is typeof c & { id: string } => Boolean(c.id))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions, categories]);
  const totalCatSpend = categorySpend.reduce((s, c) => s + c.amount, 0);

  if (categorySpend.length === 0) return null;

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold" style={{ color: C.text }}>
          이번 달 지출
        </h2>
        <Link
          href={`/${params.locale}/transactions`}
          className="text-xs font-semibold"
          style={{ color: C.textMuted }}
        >
          전체 →
        </Link>
      </div>
      <div className="bg-white rounded-2xl p-5 space-y-3">
        {categorySpend.map((c) => {
          const Icon = getCategoryIcon(c.icon ?? "");
          const pct = totalCatSpend ? (c.amount / totalCatSpend) * 100 : 0;
          return (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: (c.color ?? C.textMuted) + "20" }}
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      style={{ color: c.color ?? C.textMuted }}
                      strokeWidth={2.2}
                    />
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: C.text }}
                  >
                    {c.name}
                  </span>
                </div>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: C.text }}
                >
                  {fmt(c.amount)}원
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: C.bg }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: c.color ?? C.textMuted,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
