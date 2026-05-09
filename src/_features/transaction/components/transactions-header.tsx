"use client";

import { ArrowLeftRight, Grid3x3, List } from "lucide-react";
import { toast } from "sonner";

import {
  useTransactionStore,
  type TransactionFilter,
  type TransactionView,
} from "_features/transaction/store";
import { C } from "_styles/design-tokens";

const VIEWS: { v: TransactionView; l: string; i: typeof List }[] = [
  { v: "list", l: "목록", i: List },
  { v: "calendar", l: "달력", i: Grid3x3 },
];

const FILTERS: { v: TransactionFilter; l: string }[] = [
  { v: "all", l: "전체" },
  { v: "expense", l: "지출" },
  { v: "income", l: "수입" },
  { v: "transfer", l: "이체" },
];

/**
 * 거래 페이지 상단 — 타이틀 + 이체 버튼 + view 탭 + filter chip.
 */
export function TransactionsHeader() {
  const view = useTransactionStore((s) => s.view);
  const setView = useTransactionStore((s) => s.setView);
  const filter = useTransactionStore((s) => s.filter);
  const setFilter = useTransactionStore((s) => s.setFilter);

  return (
    <div className="bg-white sticky top-0 z-20">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-extrabold" style={{ color: C.text }}>
          거래
        </h1>
        <button
          type="button"
          onClick={() => toast("이체 (구현 예정)")}
          className="px-3 py-1.5 rounded-full flex items-center gap-1"
          style={{ background: C.purpleLight }}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" style={{ color: C.purple }} />
          <span className="text-xs font-bold" style={{ color: C.purple }}>
            이체
          </span>
        </button>
      </div>
      <div className="px-4 pb-3 flex gap-2">
        {VIEWS.map((o) => {
          const active = view === o.v;
          const Icon = o.i;
          return (
            <button
              type="button"
              key={o.v}
              onClick={() => setView(o.v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: active ? C.text : C.bg,
                color: active ? "#fff" : C.textSub,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">{o.l}</span>
            </button>
          );
        })}
      </div>
      {view === "list" && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => {
            const active = filter === f.v;
            return (
              <button
                type="button"
                key={f.v}
                onClick={() => setFilter(f.v)}
                className="px-3 py-1.5 rounded-full whitespace-nowrap"
                style={{
                  background: active ? C.blueLight : C.bg,
                  color: active ? C.blue : C.textSub,
                }}
              >
                <span className="text-xs font-semibold">{f.l}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
