"use client";

import { Collapse, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export interface DonutBreakdownItem {
  /** React key + 안정 식별자 */
  key: string;
  /** 표시명 (종목명 / 계좌명 등) */
  label: string;
  /** 슬라이스 크기 (양수만 유효, 0 이하는 자동 제외) */
  value: number;
  /** hex 색상 */
  color: string;
  /** "외 N개" 처럼 묶인 항목의 펼침 상세 — 있으면 범례에서 탭하면 펼쳐짐 */
  children?: DonutBreakdownItem[];
}

/** 범례 한 줄 — children 있으면 탭해서 묶인 항목 펼침 */
function LegendRow({
  item,
  total,
}: {
  item: DonutBreakdownItem;
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const pct = total > 0 ? (item.value / total) * 100 : 0;
  const expandable = (item.children?.length ?? 0) > 0;

  const head = (
    <Group justify="space-between" gap={6} wrap="nowrap">
      <Group gap={6} wrap="nowrap" style={{ minWidth: 0 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: item.color,
            flexShrink: 0,
          }}
        />
        <Text size="11px" fw={700} truncate>
          {item.label}
        </Text>
        {expandable && (
          <IconChevronDown
            size={12}
            style={{
              flexShrink: 0,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 120ms",
              color: "var(--mantine-color-gray-5)",
            }}
          />
        )}
      </Group>
      <Text
        size="10px"
        c="dimmed"
        fw={700}
        style={{ flexShrink: 0, fontVariantNumeric: "tabular-nums" }}
      >
        {pct.toFixed(0)}%
      </Text>
    </Group>
  );

  if (!expandable) return head;

  return (
    <Stack gap={4}>
      <UnstyledButton onClick={() => setOpen((v) => !v)}>{head}</UnstyledButton>
      <Collapse in={open}>
        <Stack gap={3} pl={12}>
          {item.children!.map((c) => {
            const cPct = total > 0 ? (c.value / total) * 100 : 0;
            return (
              <Group key={c.key} justify="space-between" gap={6} wrap="nowrap">
                <Text size="10px" c="dimmed" truncate style={{ minWidth: 0 }}>
                  {c.label}
                </Text>
                <Text
                  size="10px"
                  c="dimmed"
                  style={{ flexShrink: 0, fontVariantNumeric: "tabular-nums" }}
                >
                  {cPct.toFixed(0)}%
                </Text>
              </Group>
            );
          })}
        </Stack>
      </Collapse>
    </Stack>
  );
}

interface Props {
  items: DonutBreakdownItem[];
  /** 좌측 리스트에 표시할 상위 항목 수 */
  topN?: number;
  /** 도넛+레전드 배치. vertical = 좁은 카드용(도넛 위·레전드 아래) */
  orientation?: "horizontal" | "vertical";
}

/**
 * 일반화된 도넛 분포 차트 — 슬라이스 + 상위 N개 리스트.
 *
 * 크기는 CSS class `.chart-donut-wrap` (globals.css) 가 viewport 별로 분기:
 * 모바일/패드 88px, 데스크탑(>=lg) 144px. inner/outer radius 는 % 라 자동 비례.
 *
 * 종목/계좌 등 어떤 그룹에도 사용. 색은 호출 측에서 결정.
 * 활성 항목 (value > 0) 만 포함. 없으면 null 반환.
 */
export default function PortfolioDonut({
  items,
  topN = 3,
  orientation = "horizontal",
}: Props) {
  const t = useTranslations("general");
  const active = items.filter((i) => i.value > 0);
  if (active.length === 0) return null;

  const sorted = [...active].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((s, i) => s + i.value, 0);

  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const restSum = rest.reduce((s, i) => s + i.value, 0);

  // 상위 N개를 넘어가는 항목은 "외 N개" 한 줄로 묶되, 탭하면 펼쳐지도록 children 로 전달
  const restItem: DonutBreakdownItem | null =
    rest.length > 0
      ? {
          key: "__rest",
          label: t("etc_count", { count: rest.length }),
          value: restSum,
          color: "var(--mantine-color-gray-4)",
          children: rest,
        }
      : null;

  const isVertical = orientation === "vertical";

  const donut = (
    <div className="chart-donut-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sorted}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius="64%"
            outerRadius="96%"
            paddingAngle={1}
            stroke="none"
            isAnimationActive={false}
          >
            {sorted.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const legend = (
    <Stack gap={4} style={{ flex: 1, minWidth: 0, width: "100%" }}>
      {top.map((it) => (
        <LegendRow key={it.key} item={it} total={total} />
      ))}
      {restItem && <LegendRow item={restItem} total={total} />}
    </Stack>
  );

  if (isVertical) {
    return (
      <Stack gap="sm" align="center">
        {donut}
        {legend}
      </Stack>
    );
  }

  return (
    <Group gap="md" wrap="nowrap" align="center">
      {donut}
      {legend}
    </Group>
  );
}
