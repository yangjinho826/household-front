"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { useAccountContext } from "_features/account/context";
import { usePortfolioContext } from "_features/portfolio/context";
import { fmt } from "_utilities/fmt";
import { C } from "_styles/design-tokens";

/**
 * 홈 화면 — 총자산 hero 카드. accounts + portfolio 합산.
 */
export function TotalAssetsCard() {
  const params = useParams<{ locale: string }>();
  const { accounts } = useAccountContext();
  const { portfolio } = usePortfolioContext();

  const totalAssets =
    accounts.reduce((s, a) => s + a.balance, 0) +
    portfolio.reduce((s, p) => s + p.currentValue, 0);

  return (
    <div className="px-4 pt-4">
      <div
        className="bg-white rounded-3xl p-6"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
      >
        <p className="text-xs font-medium mb-2" style={{ color: C.textMuted }}>
          총 자산
        </p>
        <p
          className="text-3xl font-extrabold tabular-nums"
          style={{ color: C.text }}
        >
          {fmt(totalAssets)}
          <span className="text-lg ml-1">원</span>
        </p>
        <Link
          href={`/${params.locale}/wealth`}
          className="mt-3 inline-flex text-xs font-semibold items-center gap-1"
          style={{ color: C.blue }}
        >
          자세히 보기 <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
