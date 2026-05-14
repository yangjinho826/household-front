"use client";

import { Group, Stack, Text } from "@mantine/core";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { pickPortfolioColor } from "../utils";
import type { PortfolioListItemType } from "../types";

interface Props {
  portfolios: PortfolioListItemType[];
  /** 도넛 가로/세로 px (정사각형) */
  size?: number;
  /** 좌측 리스트에 표시할 상위 종목 수 */
  topN?: number;
}

/**
 * 계좌 안 종목 분포 — 도넛 + 상위 N개 리스트.
 * 슬라이스 크기는 `currentValue` 기준. 같은 ticker 는 항상 같은 색.
 * 활성 종목(현재가치 > 0) 만 포함. 없으면 null 반환.
 */
export default function PortfolioDonut({
  portfolios,
  size = 88,
  topN = 3,
}: Props) {
  const active = portfolios.filter(
    (p) => !p.isArchived && p.currentValue > 0,
  );
  if (active.length === 0) return null;

  const sorted = [...active].sort((a, b) => b.currentValue - a.currentValue);
  const total = sorted.reduce((s, p) => s + p.currentValue, 0);

  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const restSum = rest.reduce((s, p) => s + p.currentValue, 0);
  const restPct = total > 0 ? (restSum / total) * 100 : 0;

  const chartData = sorted.map((p) => ({
    name: p.ticker,
    value: p.currentValue,
    color: pickPortfolioColor(p.ticker),
  }));

  return (
    <Group gap="md" wrap="nowrap" align="center">
      <div style={{ width: size, height: size, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={size * 0.32}
              outerRadius={size * 0.48}
              paddingAngle={1}
              stroke="none"
              isAnimationActive={false}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
        {top.map((p) => {
          const pct = total > 0 ? (p.currentValue / total) * 100 : 0;
          return (
            <Group
              key={p.portfolioId}
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
                    background: pickPortfolioColor(p.ticker),
                    flexShrink: 0,
                  }}
                />
                <Text size="11px" fw={700} truncate>
                  {p.ticker}
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
