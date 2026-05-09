"use client";

import { toast } from "sonner";

import { useFixedContext } from "_features/fixed/context";
import { useTransactionStore } from "_features/transaction/store";
import { fmt } from "_utilities/fmt";
import { C } from "_styles/design-tokens";

/**
 * 거래 페이지 하단 — 고정지출 참조.
 * list view 일 때만 표시.
 */
export function FixedReference() {
  const { fixed } = useFixedContext();
  const view = useTransactionStore((s) => s.view);
  if (view !== "list") return null;

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold" style={{ color: C.text }}>
          고정지출 참조
        </h3>
        <button
          type="button"
          onClick={() => toast("고정지출 관리 (구현 예정)")}
          className="text-xs font-semibold"
          style={{ color: C.textMuted }}
        >
          관리 →
        </button>
      </div>
      <div className="bg-white rounded-2xl p-4">
        <div className="grid grid-cols-2 gap-3">
          {fixed.map((f) => (
            <div key={f.id}>
              <p
                className="text-xs font-medium mb-0.5"
                style={{ color: C.textMuted }}
              >
                {f.name} · 매월 {f.day}일
              </p>
              <p
                className="text-sm font-bold tabular-nums"
                style={{ color: C.text }}
              >
                {fmt(f.amount)}원
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
