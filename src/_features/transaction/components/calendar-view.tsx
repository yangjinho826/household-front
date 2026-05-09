"use client";

import { useTransactionStore } from "_features/transaction/store";
import { C } from "_styles/design-tokens";

/**
 * 거래 페이지 — 달력 뷰 (placeholder, 추후 구현).
 */
export function CalendarView() {
  const view = useTransactionStore((s) => s.view);
  if (view !== "calendar") return null;

  return (
    <div className="px-4 pt-6">
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-sm font-semibold" style={{ color: C.textMuted }}>
          달력 뷰는 다음 단계에서 구현됩니다.
        </p>
      </div>
    </div>
  );
}
