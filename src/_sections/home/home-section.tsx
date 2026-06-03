"use client";

import {
  Anchor,
  Card,
  Center,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

import PortfolioDonut from "_features/portfolio/components/portfolio-donut";
import { ASSET_CLASS_COLOR } from "_features/portfolio/constants";
import { usePortfolioOverview } from "_features/portfolio/queries/use-query";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";
import TxRow from "_features/transaction/components/tx-row";
import { useMoney } from "_features/common/hooks/use-money";
import { queryKeys } from "_constants/queries";

import TotalAssetHero from "./components/total-asset-hero";

export default function HomeSection() {
  const routeParams = useParams<{ locale: string }>();
  const t = useTranslations("home");
  const tAssetClass = useTranslations("enum.asset-class");
  const money = useMoney();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // 홈 = 자산 대시보드. wealth(자산군 배분)·home(월간 가계부)·portfolio(투자) 요약 조합.
  const { data: homeRes } = useSuspenseQuery(
    queryKeys.home.overview({ year: currentYear, month: currentMonth }),
  );
  const { data: wealthRes } = useSuspenseQuery(queryKeys.wealth.overview({}));
  const { data: portfolioRes } = usePortfolioOverview();

  const home = homeRes.body.data;
  const txns = home.recentTransactions;
  const stats = home.stats;
  const income = stats.monthlyIncome;
  const expense = stats.monthlyExpense;
  const savingRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  const allocationItems = wealthRes.body.data.allocation.currentAllocation.map(
    (s) => ({
      key: s.assetClass,
      label: tAssetClass(s.assetClass),
      value: s.valuation,
      color: ASSET_CLASS_COLOR[s.assetClass],
    }),
  );

  const summary = portfolioRes.body.data.summary;
  const investAccounts = portfolioRes.body.data.investmentAccounts;
  const hasInvestment = investAccounts.length > 0;

  // B 레이아웃: hero 밑에 자산구성·투자를 2열로 묶어 첫 스크롤에 핵심을 모은다.
  const hasAllocation = allocationItems.length > 0;

  const assetCard = hasAllocation ? (
    <Card h="100%">
      <Group justify="space-between" align="center" mb="sm">
        <Text size="sm" fw={700}>
          {t("asset_allocation")}
        </Text>
        <Anchor
          component={Link}
          href={`/${routeParams.locale}/wealth`}
          size="xs"
          fw={600}
          c="dimmed"
        >
          {t("go_wealth")}
        </Anchor>
      </Group>
      <PortfolioDonut items={allocationItems} orientation="vertical" />
    </Card>
  ) : null;

  const investCard = hasInvestment ? (
    <Card h="100%">
      <Group justify="space-between" align="center" mb="sm">
        <Text size="sm" fw={700}>
          {t("invest")}
        </Text>
        <Anchor
          component={Link}
          href={`/${routeParams.locale}/invest`}
          size="xs"
          fw={600}
          c="dimmed"
        >
          {t("go_invest")}
        </Anchor>
      </Group>
      <Stack gap="md">
        <Stack gap={2}>
          <Text size="xs" c="dimmed" fw={500}>
            {t("valuation")}
          </Text>
          <Text
            size="lg"
            fw={700}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {money(summary.totalValuation)}
          </Text>
        </Stack>
        <Stack gap={2}>
          <Text size="xs" c="dimmed" fw={500}>
            {t("profit_loss")}
          </Text>
          <Text
            size="md"
            fw={700}
            c={profitColor(summary.totalProfit)}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatProfitAmount(summary.totalProfit, money)}
          </Text>
          <Text
            size="xs"
            fw={700}
            c={profitColor(summary.totalProfit)}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            ({formatProfitRate(summary.totalRate)})
          </Text>
        </Stack>

        {/* 보유 투자계좌별 평가액 — 빈공간 채움 + 투자 탭 미리보기 */}
        <Stack
          gap={8}
          pt="sm"
          style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
        >
          {investAccounts.slice(0, 3).map(({ account }) => (
            <Group
              key={account.accountId}
              justify="space-between"
              wrap="nowrap"
              gap={8}
            >
              <Text size="xs" fw={500} c="dimmed" truncate>
                {account.name}
              </Text>
              <Text
                size="xs"
                fw={600}
                style={{
                  fontVariantNumeric: "tabular-nums",
                  flexShrink: 0,
                }}
              >
                {money(account.portfolioValuation ?? 0)}
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  ) : null;

  return (
    <Stack gap="md">
      {/* [1] 총자산 hero — 월별 추이 / 드릴다운 / 지난달 박제 */}
      <TotalAssetHero />

      {/* [2] 자산구성 + 투자 2열 — 둘 다 있으면 그리드, 하나면 풀폭 */}
      {assetCard && investCard ? (
        <SimpleGrid cols={2} spacing="md">
          {assetCard}
          {investCard}
        </SimpleGrid>
      ) : (
        <>
          {assetCard}
          {investCard}
        </>
      )}

      {/* [3] 이번 달 가계부 요약 — 상세는 거래 탭 */}
      <Card>
        <Group justify="space-between" align="center" mb="sm">
          <Text size="sm" fw={700}>
            {t("this_month")}
          </Text>
          <Anchor
            component={Link}
            href={`/${routeParams.locale}/transactions`}
            size="xs"
            fw={600}
            c="dimmed"
          >
            {t("go_transactions")}
          </Anchor>
        </Group>
        <SimpleGrid cols={3} spacing="sm">
          <Stack gap={2}>
            <Text size="xs" c="dimmed" fw={500}>
              {t("income")}
            </Text>
            <Text
              size="md"
              fw={700}
              c="info.5"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {money(income)}
            </Text>
          </Stack>
          <Stack gap={2}>
            <Text size="xs" c="dimmed" fw={500}>
              {t("expense")}
            </Text>
            <Text
              size="md"
              fw={700}
              c="danger.5"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {money(expense)}
            </Text>
          </Stack>
          <Stack gap={2}>
            <Text size="xs" c="dimmed" fw={500}>
              {t("saving_rate")}
            </Text>
            <Text
              size="md"
              fw={700}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {savingRate.toFixed(0)}%
            </Text>
          </Stack>
        </SimpleGrid>
      </Card>

      {/* [4] 최근 거래 */}
      <Stack gap="xs">
        <Group justify="space-between" align="center" px={4}>
          <Text size="sm" fw={700}>
            {t("recent_transactions")}
          </Text>
          <Anchor
            component={Link}
            href={`/${routeParams.locale}/transactions`}
            size="xs"
            fw={600}
            c="dimmed"
          >
            {t("go_all")}
          </Anchor>
        </Group>
        <Card p="xs">
          {txns.length === 0 ? (
            <Center py="lg">
              <Text c="dimmed" size="sm">
                {t("no_transactions")}
              </Text>
            </Center>
          ) : (
            <Stack gap={0}>
              {txns.slice(0, 5).map((tx) => (
                <TxRow key={tx.transactionId} item={tx} />
              ))}
            </Stack>
          )}
        </Card>
      </Stack>
    </Stack>
  );
}
