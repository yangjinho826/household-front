"use client";

import DynamicIcon from "_features/common/components/dynamic-icon";
import { DEFAULT_ACCENT } from "_styles/design-tokens";

interface IconBoxProps {
  /** lucide / tabler 아이콘 이름. 없으면 fallback 아이콘 */
  icon?: string | null;
  /** hex 색상. 없으면 DEFAULT_ACCENT */
  color?: string | null;
  /** 박스 한 변 크기 (기본 40) */
  size?: number;
}

/**
 * 토스 스타일 아이콘 박스 — 좌측 색상 박스 + 중앙 아이콘.
 *
 * 거래 row, 고정지출 row, 카테고리 row 등 리스트 표시에서 공통 사용.
 * 색상은 알파 10% 배경 + 100% 아이콘.
 */
export default function IconBox({ icon, color, size = 40 }: IconBoxProps) {
  const accent: string = color ?? DEFAULT_ACCENT;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        background: `${accent}1A`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <DynamicIcon
        name={icon ?? undefined}
        size={Math.round(size * 0.5)}
        stroke={2.2}
        color={accent}
      />
    </div>
  );
}
