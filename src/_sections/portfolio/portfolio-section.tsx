"use client";

import {
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import { portfolioHistoryMockStore } from "_features/portfolio-history/mock";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";
import InvestmentAccountCard from "_sections/wealth/components/investment-account-card";
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

export default function PortfolioSection() {
  const { data: accountData } = useSuspenseQuery(
    queryKeys.account.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: portfolioData } = useSuspenseQuery(
    queryKeys.portfolio.list({ pageNo: 1, listSize: 200 }),
  );
  // history fetch (mock 차트 데이터)
  useSuspenseQuery(queryKeys.portfolioHistory.list({}));

  const accounts = accountData.body.data.content;
  const portfolios = portfolioData.body.data.content;

  const investmentAccounts = useMemo(
    () => accounts.filter((a) => a.accountType === "INVESTMENT"),
    [accounts],
  );

  // 백엔드가 계좌별 cash/portfolio_* 다 내려주니까 그대로 합산
  const summary = useMemo(() => {
    let totalBalance = 0;
    let totalCash = 0;
    let totalValuation = 0;
    let totalCost = 0;
    let totalProfit = 0;
    for (const a of investmentAccounts) {
      totalBalance += a.balance;
      totalCash += a.cash ?? 0;
      totalValuation += a.portfolioValuation ?? 0;
      totalCost += a.portfolioCost ?? 0;
      totalProfit += a.portfolioProfitLoss ?? 0;
    }
    const totalRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    return {
      totalBalance,
      totalCash,
      totalValuation,
      totalCost,
      totalProfit,
      totalRate,
    };
  }, [investmentAccounts]);

  const trendData = useMemo(
    () =>
      portfolioHistoryMockStore.aggregateByMonth().map((m) => ({
        month: m.month.slice(5) + "월",
        value: m.value,
      })),
    [],
  );

  return (
    <Stack gap="md">
      <Title order={3}>포트폴리오</Title>

      {/* 전체 계좌 hero — 계좌 0개면 숨김 (아래 "투자 계좌 없습니다" 카드가 대신 안내) */}
      {investmentAccounts.length > 0 && (
        <>
          <Card radius="xl" p="lg">
            <Stack gap={8}>
              <Stack gap={2}>
                <Text size="xs" fw={500} c="dimmed">
                  전체 계좌
                </Text>
                <Text
                  size="1.75rem"
                  fw={800}
                  style={{
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1.1,
                  }}
                >
                  {fmt(summary.totalBalance)}
                  <Text span size="md" c="dimmed" ml={4} fw={600}>
                    원
                  </Text>
                </Text>
                <Group gap={4} mt={2}>
                  <Text
                    size="sm"
                    fw={700}
                    c={profitColor(summary.totalProfit)}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatProfitAmount(summary.totalProfit, fmt)}원
                  </Text>
                  <Text
                    size="sm"
                    fw={700}
                    c={profitColor(summary.totalProfit)}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    ({formatProfitRate(summary.totalRate)})
                  </Text>
                </Group>
              </Stack>

              <Divider my={4} />

              <SimpleGrid cols={2} spacing="md" verticalSpacing={6}>
                <SummaryRow
                  label="총평가손익"
                  value={`${formatProfitAmount(summary.totalProfit, fmt)}원`}
                  color={profitColor(summary.totalProfit)}
                />
                <SummaryRow
                  label="총평가금액"
                  value={`${fmt(summary.totalValuation)}원`}
                />
                <SummaryRow
                  label="현금"
                  value={`${fmt(summary.totalCash)}원`}
                />
                <SummaryRow
                  label="총매입금액"
                  value={`${fmt(summary.totalCost)}원`}
                />
              </SimpleGrid>
            </Stack>
          </Card>

          {/* 월별 추이 — hero 와 별도 카드 */}
          {trendData.length > 0 && (
            <Card radius="xl" p="md">
              <Stack gap={4}>
                <Text size="xs" fw={500} c="dimmed" px={4}>
                  월별 추이
                </Text>
                <ResponsiveContainer width="100%" height={96} minWidth={0}>
                  <AreaChart
                    data={trendData}
                    margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="portfolioTrend"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      strokeWidth={2.5}
                      fill="url(#portfolioTrend)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10, fill: "#8B95A1" }}
                      axisLine={false}
                      tickLine={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Stack>
            </Card>
          )}
        </>
      )}

      {/* 투자 계좌 리스트 */}
      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          투자 계좌 ({investmentAccounts.length})
        </Text>
      </Group>

      {investmentAccounts.length === 0 ? (
        <Card radius="lg" p="xl">
          <Text size="sm" c="dimmed" ta="center">
            등록된 투자 계좌가 없습니다
          </Text>
        </Card>
      ) : (
        <Stack gap="sm">
          {investmentAccounts.map((a) => {
            const owned = portfolios.filter(
              (p) => p.accountId === a.accountId && !p.isArchived,
            );
            return (
              <InvestmentAccountCard
                key={a.accountId}
                account={a}
                portfolios={owned}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

function SummaryRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <Group justify="space-between" wrap="nowrap" gap={8}>
      <Text size="xs" c="dimmed" fw={500}>
        {label}
      </Text>
      <Text
        size="sm"
        fw={700}
        c={color}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </Text>
    </Group>
  );
}
