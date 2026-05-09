"use client";

import { useAccountContext } from "_features/account/context";
import { usePortfolioContext } from "_features/portfolio/context";
import { useTransactionContext } from "_features/transaction/context";
import { C } from "_styles/design-tokens";

/**
 * 설정 페이지 — 통장/거래/종목 카운트 3 그리드.
 */
export function BudgetStatsGrid() {
  const { accounts } = useAccountContext();
  const { transactions } = useTransactionContext();
  const { portfolio } = usePortfolioContext();

  return (
    <div className="px-4 pt-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCell label="통장" count={accounts.length} />
        <StatCell label="거래" count={transactions.length} />
        <StatCell label="종목" count={portfolio.length} />
      </div>
    </div>
  );
}

function StatCell({ label, count }: { label: string; count: number }) {
  return (
    <div className="bg-white rounded-2xl p-4 text-center">
      <p className="text-lg font-extrabold" style={{ color: C.text }}>
        {count}
      </p>
      <p className="text-[10px] font-medium" style={{ color: C.textMuted }}>
        {label}
      </p>
    </div>
  );
}
