"use client";

import { Card, Group, Stack, Text } from "@mantine/core";
import { useMemo } from "react";

import { useMonthLabel } from "_features/common/hooks/use-month-label";
import { usePortfolioValueHistoryByItem } from "_features/portfolio/queries/use-query";

import ValueTrendChart, { type TrendPoint } from "./value-trend-chart";

interface Props {
  portfolioId: string;
}

// 종목 상세 — 그 종목의 월별 평가액(valuation) 추이
export default function PortfolioValueTrend({ portfolioId }: Props) {
  const monthLabel = useMonthLabel();
  const { data } = usePortfolioValueHistoryByItem(portfolioId);
  const history = data.body.data.history;

  const trend = useMemo<TrendPoint[]>(
    () =>
      history.map((h, i) => {
        const prev = i > 0 ? (history[i - 1]?.valuation ?? null) : null;
        const momPct =
          prev && prev > 0 ? ((h.valuation - prev) / prev) * 100 : null;
        return {
          month: monthLabel(h.snapshotDate),
          value: h.valuation,
          momPct,
        };
      }),
    [history, monthLabel],
  );

  // 첫 박제월 대비 최근 평가액 증감
  const periodPct = useMemo(() => {
    const first = history[0]?.valuation;
    const last = history[history.length - 1]?.valuation;
    if (!first || first <= 0 || last === undefined || history.length < 2)
      return null;
    return ((last - first) / first) * 100;
  }, [history]);

  // 데이터 0~1건이면 추이로서 의미 없음 — 숨김
  if (trend.length < 2) return null;

  return (
    // 툴팁 세로 이탈(allowEscapeViewBox) 허용 — 카드가 잘라내지 않게
    <Card radius="xl" p="md" style={{ overflow: "visible" }}>
      <Stack gap={6}>
        <Group justify="space-between" align="center" px={4}>
          <Text size="xs" fw={500} c="dimmed">
            평가액 추이
          </Text>
          {periodPct !== null && (
            <Text
              size="xs"
              fw={700}
              c={periodPct >= 0 ? "positive.6" : "danger.5"}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              최근 {trend.length}개월 {periodPct >= 0 ? "+" : "−"}
              {Math.abs(periodPct).toFixed(1)}%
            </Text>
          )}
        </Group>
        <ValueTrendChart data={trend} />
      </Stack>
    </Card>
  );
}
