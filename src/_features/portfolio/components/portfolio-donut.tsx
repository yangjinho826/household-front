"use client";

import { Group, Stack, Text } from "@mantine/core";
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
  const active = items.filter((i) => i.value > 0);
  if (active.length === 0) return null;

  const sorted = [...active].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((s, i) => s + i.value, 0);

  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const restSum = rest.reduce((s, i) => s + i.value, 0);
  const restPct = total > 0 ? (restSum / total) * 100 : 0;

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
      {top.map((it) => {
        const pct = total > 0 ? (it.value / total) * 100 : 0;
        return (
          <Group key={it.key} justify="space-between" gap={6} wrap="nowrap">
            <Group gap={6} wrap="nowrap" style={{ minWidth: 0 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: it.color,
                  flexShrink: 0,
                }}
              />
              <Text size="11px" fw={700} truncate>
                {it.label}
              </Text>
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
      })}
      {rest.length > 0 && (
        <Text size="10px" c="dimmed" fw={600}>
          외 {rest.length}개 ({restPct.toFixed(0)}%)
        </Text>
      )}
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
