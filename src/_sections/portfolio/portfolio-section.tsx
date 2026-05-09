"use client";

import {
  ActionIcon,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import { portfolioHistoryMockStore } from "_features/portfolio-history/mock";
import PortfolioSearch from "_features/portfolio/components/search";
import PortfolioTable from "_features/portfolio/components/table";
import { usePortfolioSearch } from "_features/portfolio/hooks/use-sub/use-search";
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

export default function PortfolioSection() {
  const t = useTranslations("portfolio");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const {
    searchform,
    onSearch,
    onReset,
    result,
    params,
    handlePageChange,
  } = usePortfolioSearch();

  // history fetch (mock)
  useSuspenseQuery(queryKeys.portfolioHistory.list({}));

  const items = result?.content ?? [];
  const totalPages = result?.totalPages ?? 1;

  const totalValue = items.reduce((sum, p) => sum + p.currentValue, 0);
  const totalCost = items.reduce(
    (sum, p) => sum + p.avgPrice * p.quantity,
    0,
  );
  const profit = totalValue - totalCost;
  const ratio = totalCost > 0 ? (profit / totalCost) * 100 : 0;

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
      <Group justify="space-between" align="center">
        <Title order={3}>{t("list_title")}</Title>
        <ActionIcon
          size="lg"
          radius="xl"
          onClick={() => router.push(`/${routeParams.locale}/portfolio/new`)}
          aria-label={t("add")}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>

      {/* 평가금액 hero + 차트 */}
      <Card radius="xl" p="lg">
        <Stack gap={4}>
          <Text size="xs" fw={500} c="dimmed">
            평가금액
          </Text>
          <Text
            size="2rem"
            fw={800}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(totalValue)}
            <Text span size="lg" c="dimmed" ml={4} fw={600}>
              원
            </Text>
          </Text>
          <Group gap="xs">
            <Text
              size="sm"
              fw={700}
              c={profit >= 0 ? "tossRed.5" : "tossBlue.5"}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {profit >= 0 ? "+" : ""}
              {fmt(profit)}원
            </Text>
            <Text size="sm" c="dimmed">
              ({ratio.toFixed(2)}%)
            </Text>
          </Group>
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
          </div>
        </Stack>
      </Card>

      <PortfolioSearch
        form={searchform}
        onSearch={onSearch}
        onReset={onReset}
      />

      <PortfolioTable
        items={items}
        totalPages={totalPages}
        pageNo={params.pageNo}
        listSize={params.listSize}
        onClickRow={(id) =>
          router.push(`/${routeParams.locale}/portfolio/${id}`)
        }
        onPageChange={handlePageChange}
      />
    </Stack>
  );
}
