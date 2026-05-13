"use client";

import { ActionIcon, Group, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

import { currentYearMonthKst } from "_utilities/datetime";

interface MonthPickerProps {
  /** "YYYY-MM" */
  value: string;
  onChange: (next: string) => void;
}

/**
 * 월 선택 — 좌/우 화살표로 이전/다음 달 이동.
 *
 * value/onChange 는 "YYYY-MM" 문자열로 외부 동기화 (URL/state 둘 다 호환).
 */
export default function MonthPicker({ value, onChange }: MonthPickerProps) {
  const [yearStr, monthStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);

  const shift = (delta: number) => {
    const total = year * 12 + (month - 1) + delta;
    const nextYear = Math.floor(total / 12);
    const nextMonth = (total % 12) + 1;
    onChange(`${nextYear}-${String(nextMonth).padStart(2, "0")}`);
  };

  return (
    <Group justify="space-between" align="center">
      <ActionIcon variant="subtle" onClick={() => shift(-1)} aria-label="prev month">
        <IconChevronLeft size={16} />
      </ActionIcon>
      <Text fw={700}>
        {year}년 {month}월
      </Text>
      <ActionIcon variant="subtle" onClick={() => shift(1)} aria-label="next month">
        <IconChevronRight size={16} />
      </ActionIcon>
    </Group>
  );
}

/** 이번달 "YYYY-MM" 기본값 */
export const defaultYearMonth = currentYearMonthKst;
