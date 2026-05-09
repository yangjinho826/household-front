"use client";

import { useSampleContext } from "_features/sample/context";
import { C } from "_styles/design-tokens";

/**
 * 샘플 페이지 — 총 개수 hero 카드.
 */
export function SampleSummaryCard() {
  const { samples } = useSampleContext();

  return (
    <div className="px-4 pt-4">
      <div className="bg-white rounded-3xl p-6 mb-3">
        <p className="text-xs font-medium mb-2" style={{ color: C.textMuted }}>
          학습용 표준 모듈
        </p>
        <p
          className="text-2xl font-extrabold tabular-nums"
          style={{ color: C.text }}
        >
          {samples.length}
          <span className="text-base ml-1 font-bold">개</span>
        </p>
      </div>
    </div>
  );
}
