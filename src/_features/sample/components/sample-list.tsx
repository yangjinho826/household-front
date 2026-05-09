"use client";

import { useSampleContext } from "_features/sample/context";
import { C } from "_styles/design-tokens";

import { SampleRow } from "./sample-row";

/**
 * 샘플 페이지 — 목록 (samples 배열 → SampleRow 매핑).
 */
export function SampleList() {
  const { samples, isLoading, openDetail } = useSampleContext();

  return (
    <div className="px-4 pt-2">
      <h2 className="text-sm font-bold mb-2 px-2" style={{ color: C.text }}>
        전체 목록
      </h2>
      <div className="bg-white rounded-2xl p-2">
        {isLoading ? (
          <p
            className="text-center py-12 text-sm"
            style={{ color: C.textMuted }}
          >
            불러오는 중...
          </p>
        ) : samples.length === 0 ? (
          <p
            className="text-center py-12 text-sm"
            style={{ color: C.textMuted }}
          >
            샘플이 없습니다. + 버튼으로 추가하세요
          </p>
        ) : (
          samples.map((s) => (
            <SampleRow
              key={s.id}
              sample={s}
              onClick={() => openDetail(s.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
