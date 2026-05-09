"use client";

import { useMemo } from "react";
import { toast } from "sonner";

import { useTransactionContext } from "_features/transaction/context";
import { useTransactionStore } from "_features/transaction/store";
import { TxRow } from "./tx-row";
import { C } from "_styles/design-tokens";

/**
 * 거래 페이지 — 필터링된 거래 목록 (list view).
 */
export function TransactionList() {
  const { transactions } = useTransactionContext();
  const filter = useTransactionStore((s) => s.filter);
  const view = useTransactionStore((s) => s.view);

  const filtered = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  if (view !== "list") return null;

  const onSelect = () => toast("거래 상세 (구현 예정)");

  return (
    <div className="px-4 pt-3">
      <div className="bg-white rounded-2xl p-2">
        {filtered.length === 0 ? (
          <p
            className="text-center py-12 text-sm"
            style={{ color: C.textMuted }}
          >
            거래 내역이 없습니다
          </p>
        ) : (
          filtered.map((t) => <TxRow key={t.id} tx={t} onSelect={onSelect} />)
        )}
      </div>
    </div>
  );
}
