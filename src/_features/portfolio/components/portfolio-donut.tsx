"use client";

import { Group, Stack, Text } from "@mantine/core";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export interface DonutBreakdownItem {
  /** React key + 안정 식별자 */
  key: string;
  /** 표시명 (ticker / 계좌명 등) */
  label: string;
  /** 슬라이스 크기 (양수만 유효, 0 이하는 자동 제외) */
  value: number;
  /** hex 색상 */
  color: string;
}

interface Props {
  items: DonutBreakdownItem[];
  /** 도넛 가로/세로 px (정사각형) */
  size?: number;
  /** 좌측 리스트에 표시할 상위 항목 수 */
  topN?: number;
}

/**
 * 일반화된 도넛 분포 차트 — 슬라이스 + 상위 N개 리스트.
 * 종목/계좌 등 어떤 그룹에도 사용. 색은 호출 측에서 결정.
 * 활성 항목 (value > 0) 만 포함. 없으면 null 반환.
 */
export default function PortfolioDonut({ items, size = 88, topN = 3 }: Props) {
  const active = items.filter((i) => i.value > 0);
  if (active.length === 0) return null;

  const sorted = [...active].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((s, i) => s + i.value, 0);

  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const restSum = rest.reduce((s, i) => s + i.value, 0);
  const restPct = total > 0 ? (restSum / total) * 100 : 0;

  return (
    <Group gap="md" wrap="nowrap" align="center">
      <div style={{ width: size, height: size, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sorted}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={size * 0.32}
              outerRadius={size * 0.48}
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
      <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
        {top.map((it) => {
          const pct = total > 0 ? (it.value / total) * 100 : 0;
          return (
            <Group
              key={it.key}
              justify="space-between"
              gap={6}
              wrap="nowrap"
            >
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
                style={{
                  flexShrink: 0,
                  fontVariantNumeric: "tabular-nums",
                }}
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
    </Group>
  );
}
