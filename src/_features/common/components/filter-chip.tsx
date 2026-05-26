"use client";

import { UnstyledButton } from "@mantine/core";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

/**
 * 토스 스타일 pill 칩 — 페이지 상단 필터 (전체/지출/수입 등) 공통 사용.
 */
export default function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        background: active
          ? "var(--mantine-color-info-0)"
          : "var(--mantine-color-gray-1)",
        color: active
          ? "var(--mantine-color-info-5)"
          : "var(--mantine-color-gray-7)",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
    </UnstyledButton>
  );
}

export type ArchiveFilter = "all" | "active" | "archived";

/** ArchiveFilter → isArchived 쿼리 파라미터 변환 */
export function toIsArchivedParam(filter: ArchiveFilter): boolean | undefined {
  if (filter === "active") return false;
  if (filter === "archived") return true;
  return undefined;
}
