"use client";

import { Card, Group, Stack, Text, Title } from "@mantine/core";
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
  portfolioCalc,
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

  const allInvestPortfolios = useMemo(
    () =>
      portfolios.filter(
        (p) =>
          !p.isArchived &&
          investmentAccounts.some((a) => a.accountId === p.accountId),
      ),
    [portfolios, investmentAccounts],
  );

  const stat = portfolioCalc(allInvestPortfolios);

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

      {/* 전체 평가 hero + 차트 */}
      <Card radius="xl" p="lg">
        <Stack gap={4}>
          <Text size="xs" fw={500} c="dimmed">
            총 평가금액
          </Text>
          <Text
            size="2rem"
            fw={800}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(stat.totalValue)}
            <Text span size="lg" c="dimmed" ml={4} fw={600}>
              원
            </Text>
          </Text>
          <Group gap={6}>
            <Text
              size="sm"
              fw={700}
              c={profitColor(stat.profit)}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatProfitAmount(stat.profit, fmt)}원
            </Text>
            <Text
              size="sm"
              fw={700}
              c={profitColor(stat.profit)}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              ({formatProfitRate(stat.profitRate)})
            </Text>
          </Group>
          <Group gap={16} mt={6}>
            <Group gap={4}>
              <Text size="11px" c="dimmed" fw={600}>
                매입금액
              </Text>
              <Text
                size="11px"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(stat.totalCost)}원
              </Text>
            </Group>
          </Group>
          {trendData.length > 0 && (
            <div style={{ height: 96, marginTop: 12 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient
                      id="portfolioTrend"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop
                        offset="100%"
                        stopColor="#8B5CF6"
                        stopOpacity={0}
                      />
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
            </div>
          )}
        </Stack>
      </Card>

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
