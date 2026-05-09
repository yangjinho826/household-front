"use client";

import { ArrowLeftRight } from "lucide-react";
import { C } from "_styles/design-tokens";
import { useAccountContext } from "_features/account/context";
import { useCategoryContext } from "_features/category/context";
import { fmt } from "_utilities/fmt";
import { getCategoryIcon } from "_utilities/icons";
import type { Transaction } from "../types";

type TxRowProps = {
  tx: Transaction;
  onSelect?: (tx: Transaction) => void;
};

export function TxRow({ tx, onSelect }: TxRowProps) {
  const { categories } = useCategoryContext();
  const { accounts } = useAccountContext();
  const cat = categories.find((c) => c.id === tx.categoryId);
  const acc = accounts.find((a) => a.id === tx.accountId);
  const toAcc = accounts.find((a) => a.id === tx.toAccountId);

  const handleClick = () => onSelect?.(tx);

  if (tx.type === "transfer") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: C.purpleLight }}
        >
          <ArrowLeftRight
            className="w-4 h-4"
            style={{ color: C.purple }}
            strokeWidth={2.2}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: C.text }}>
            {tx.memo || "이체"}
          </p>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: C.textMuted }}
          >
            {acc?.name} → {toAcc?.name}
          </p>
        </div>
        <p
          className="text-sm font-bold tabular-nums flex-shrink-0"
          style={{ color: C.purple }}
        >
          {fmt(tx.amount)}원
        </p>
      </button>
    );
  }

  const isIncome = tx.type === "income";
  const Icon = getCategoryIcon(cat?.icon ?? "");

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: (cat?.color ?? C.textMuted) + "20" }}
      >
        <Icon
          className="w-4 h-4"
          style={{ color: cat?.color ?? C.textMuted }}
          strokeWidth={2.2}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: C.text }}>
          {tx.memo || cat?.name}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: C.textMuted }}>
          {tx.date.slice(5).replace("-", "/")} · {acc?.name}
        </p>
      </div>
      <p
        className="text-sm font-bold tabular-nums flex-shrink-0"
        style={{ color: isIncome ? C.blue : C.text }}
      >
        {isIncome ? "+" : "-"}
        {fmt(tx.amount)}원
      </p>
    </button>
  );
}
