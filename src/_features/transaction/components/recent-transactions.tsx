"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useTransactionContext } from "_features/transaction/context";
import { TxRow } from "./tx-row";
import { C } from "_styles/design-tokens";

/**
 * 홈 화면 — 최근 거래 5개.
 */
export function RecentTransactions() {
  const params = useParams<{ locale: string }>();
  const { transactions } = useTransactionContext();
  const recentTx = transactions.slice(0, 5);

  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold" style={{ color: C.text }}>
          최근 거래
        </h2>
        <Link
          href={`/${params.locale}/transactions`}
          className="text-xs font-semibold"
          style={{ color: C.textMuted }}
        >
          전체 →
        </Link>
      </div>
      <div className="bg-white rounded-2xl p-2">
        {recentTx.length === 0 ? (
          <p
            className="text-center py-8 text-sm"
            style={{ color: C.textMuted }}
          >
            거래 내역이 없습니다
          </p>
        ) : (
          recentTx.map((t) => <TxRow key={t.id} tx={t} />)
        )}
      </div>
    </div>
  );
}
