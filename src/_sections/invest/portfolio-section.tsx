"use client";

import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import PortfolioDonut, {
  type DonutBreakdownItem,
} from "_features/portfolio/components/portfolio-donut";
import { usePortfolioMutations } from "_features/portfolio/queries/use-mutations";
import { usePortfolioOverview } from "_features/portfolio/queries/use-query";
import { usePortfolioSheetStore } from "_features/portfolio/store";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";
import InvestmentAccountCard from "_sections/wealth/components/investment-account-card";
import { PORTFOLIO_PALETTE, TOKEN } from "_styles/design-tokens";
import { useMoney } from "_features/common/hooks/use-money";

/** 종목 비중 도넛: 상위 N개만 고유색, 나머지는 "기타"·현금으로 회색 묶음 (색 순환 혼동 방지) */
const TOP_STOCKS = 5;

export default function PortfolioSection() {
  const t = useTranslations("portfolio");
  const money = useMoney();
  const openSheet = usePortfolioSheetStore((s) => s.open);
  const { refreshMutation } = usePortfolioMutations();

  const { data } = usePortfolioOverview();
  const { summary, investmentAccounts } = data.body.data;

  const handleRefresh = async () => {
    try {
      const res = await refreshMutation.mutateAsync();
      const fetched = res.body.data.fetched;
      notifications.show({
        message: fetched > 0 ? t("refresh_success", { count: fetched }) : t("refresh_empty"),
        color: "green",
      });
    } catch {
      notifications.show({ message: t("refresh_failed"), color: "red" });
    }
  };

  // 종목별 비중 — 전체 투자 평가액 안에서 각 종목이 차지하는 %. 상위 5 + 기타 + 현금.
  const stockBreakdown = useMemo<DonutBreakdownItem[]>(() => {
    const stocks = investmentAccounts
      .flatMap((g) => g.portfolios)
      .filter((p) => !p.isArchived && p.currentValue > 0)
      .sort((a, b) => b.currentValue - a.currentValue);

    const items: DonutBreakdownItem[] = stocks
      .slice(0, TOP_STOCKS)
      .map((p, i) => ({
        key: p.portfolioId,
        label: p.name,
        value: p.currentValue,
        color: PORTFOLIO_PALETTE[i % PORTFOLIO_PALETTE.length]!,
      }));

    const rest = stocks.slice(TOP_STOCKS);
    const restSum = rest.reduce((s, p) => s + p.currentValue, 0);
    if (restSum > 0) {
      items.push({
        key: "__rest",
        label: t("etc_count", { count: rest.length }),
        value: restSum,
        color: TOKEN.warmGrayDeep,
        pinToEnd: true,
        // 범례에서 "외 N개" 탭하면 펼쳐질 묶인 종목들
        children: rest.map((p) => ({
          key: p.portfolioId,
          label: p.name,
          value: p.currentValue,
          color: TOKEN.warmGrayDeep,
        })),
      });
    }
    if (summary.totalCash > 0) {
      items.push({
        key: "__cash",
        label: t("cash_slice"),
        value: summary.totalCash,
        color: TOKEN.warmGray,
        pinToEnd: true,
      });
    }
    return items;
  }, [investmentAccounts, summary.totalCash, t]);

  const profit = summary.totalProfit;
  // 손익 부호별 pill 배경 (텍스트색은 한국 주식 관습 profitColor: 양수 빨강·음수 파랑)
  const profitBg =
    profit > 0 ? "danger.0" : profit < 0 ? "info.0" : "gray.1";

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>{t("title")}</Title>
        <Group gap="xs">
          <ActionIcon
            radius="xl"
            size="lg"
            variant="light"
            onClick={handleRefresh}
            loading={refreshMutation.isPending}
            aria-label={t("refresh")}
          >
            <IconRefresh size={18} />
          </ActionIcon>
          <Button
            size="sm"
            radius="xl"
            leftSection={<IconPlus size={16} />}
            onClick={() => openSheet()}
          >
            {t("add_stock")}
          </Button>
        </Group>
      </Group>

      {/* 투자 손익 hero — 대표값=평가액, pill=손익, 메타=매입·현금 (계좌 0개면 숨김) */}
      {investmentAccounts.length > 0 && (
        <>
          <Card radius="xl" p="xl" shadow="md">
            <Stack gap={10}>
              <Stack gap={4}>
                <Text size="xs" fw={500} c="dimmed">
                  {t("valuation_label")}
                </Text>
                <Text
                  size="1.9rem"
                  fw={800}
                  style={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}
                >
                  {money(summary.totalValuation)}
                </Text>
                <Group
                  gap={6}
                  mt={4}
                  wrap="nowrap"
                  style={{
                    alignSelf: "flex-start",
                    background: `var(--mantine-color-${profitBg.replace(".", "-")})`,
                    borderRadius: 999,
                    padding: "4px 12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Text
                    size="sm"
                    fw={700}
                    c={profitColor(profit)}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatProfitAmount(profit, money)}
                  </Text>
                  <Text
                    size="sm"
                    fw={700}
                    c={profitColor(profit)}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    ({formatProfitRate(summary.totalRate)})
                  </Text>
                </Group>
              </Stack>

              <Divider />

              <Group gap={40}>
                <Stack gap={2}>
                  <Text size="11px" c="dimmed" fw={500}>
                    {t("buy_cost")}
                  </Text>
                  <Text
                    size="sm"
                    fw={700}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {money(summary.totalCost)}
                  </Text>
                </Stack>
                <Stack gap={2}>
                  <Text size="11px" c="dimmed" fw={500}>
                    {t("cash_label")}
                  </Text>
                  <Text
                    size="sm"
                    fw={700}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {money(summary.totalCash)}
                  </Text>
                </Stack>
              </Group>
            </Stack>
          </Card>

          {/* 종목 비중 도넛 */}
          {stockBreakdown.length > 0 && (
            <Card radius="xl" p="md">
              <Stack gap={10}>
                <Text size="sm" fw={700} px={4}>
                  {t("stock_allocation")}
                </Text>
                <PortfolioDonut
                  items={stockBreakdown}
                  topN={stockBreakdown.length}
                />
              </Stack>
            </Card>
          )}
        </>
      )}

      {/* 투자 계좌 리스트 */}
      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          {t("accounts_label")} ({investmentAccounts.length})
        </Text>
      </Group>

      {investmentAccounts.length === 0 ? (
        <Card radius="lg" p="xl">
          <Text size="sm" c="dimmed" ta="center">
            {t("empty_accounts")}
          </Text>
        </Card>
      ) : (
        <Stack gap="sm">
          {investmentAccounts.map((g) => (
            <InvestmentAccountCard
              key={g.account.accountId}
              account={g.account}
              portfolios={g.portfolios.filter((p) => !p.isArchived)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
