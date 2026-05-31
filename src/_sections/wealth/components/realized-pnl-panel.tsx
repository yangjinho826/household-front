"use client";

import { Card, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { useState } from "react";

import { useItemRealizedPnl } from "_features/portfolio/queries/use-query";
import type { RealizedPnlResponseType } from "_features/portfolio/types";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";
import { fmt } from "_utilities/fmt";

interface Props {
  portfolioId: string;
}

// 기간 프리셋 — 오늘 기준 fromDate 역산. 증권사 매매손익 화면과 동일.
const PERIOD_OPTIONS = [
  { value: "1m", label: "1개월" },
  { value: "3m", label: "3개월" },
  { value: "1y", label: "1년" },
] as const;

type Period = (typeof PERIOD_OPTIONS)[number]["value"];

function fromDateOf(period: Period): string {
  const now = new Date();
  if (period === "1m") now.setMonth(now.getMonth() - 1);
  else if (period === "3m") now.setMonth(now.getMonth() - 3);
  else now.setFullYear(now.getFullYear() - 1);
  return now.toISOString().slice(0, 10);
}

export default function RealizedPnlPanel({ portfolioId }: Props) {
  const [period, setPeriod] = useState<Period>("1y");
  const { data } = useItemRealizedPnl(portfolioId, fromDateOf(period));
  const { summary, rows }: RealizedPnlResponseType = data.body.data;

  return (
    <Stack gap="sm">
      <Group justify="flex-end">
        <SegmentedControl
          size="xs"
          value={period}
          onChange={(v) => setPeriod(v as Period)}
          data={PERIOD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </Group>

      {/* 요약 — 증권사 매매손익 헤더 */}
      <Card radius="lg" p="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              실현손익
            </Text>
            <Group gap={6}>
              <Text
                size="sm"
                fw={800}
                c={profitColor(summary.totalRealized)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatProfitAmount(summary.totalRealized, fmt)}원
              </Text>
              <Text
                size="sm"
                fw={700}
                c={profitColor(summary.totalRate)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatProfitRate(summary.totalRate)}
              </Text>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              매도금액
            </Text>
            <Text size="xs" fw={600} style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmt(summary.sellAmount)}원
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              매수금액
            </Text>
            <Text size="xs" fw={600} style={{ fontVariantNumeric: "tabular-nums" }}>
              {fmt(summary.buyAmount)}원
            </Text>
          </Group>
        </Stack>
      </Card>

      {/* 매도 건별 */}
      <Card radius="lg" p="md">
        <Stack gap="sm">
          <Text size="sm" fw={700}>
            매도 내역 ({rows.length})
          </Text>
          {rows.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              매도 내역이 없습니다
            </Text>
          ) : (
            rows.map((r) => (
              <Group key={r.txId} justify="space-between">
                <div>
                  <Text size="sm" fw={600}>
                    {r.txDate}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {fmt(r.quantity)}주 @{fmt(r.sellPrice)}원
                  </Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text
                    size="sm"
                    fw={700}
                    c={profitColor(r.realizedPnl)}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatProfitAmount(r.realizedPnl, fmt)}원
                  </Text>
                  <Text
                    size="xs"
                    fw={600}
                    c={profitColor(r.realizedRate)}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatProfitRate(r.realizedRate)}
                  </Text>
                </div>
              </Group>
            ))
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
