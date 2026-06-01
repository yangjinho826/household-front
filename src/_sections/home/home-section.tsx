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
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

import TotalAssetHero from "./components/total-asset-hero";

export default function HomeSection() {
  const routeParams = useParams<{ locale: string }>();
  const tAssetClass = useTranslations("enum.asset-class");

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
  const hasInvestment = portfolioRes.body.data.investmentAccounts.length > 0;

  return (
    <Stack gap="md">
      {/* [1] 총자산 hero — 월별 추이 / 드릴다운 / 지난달 박제 */}
      <TotalAssetHero />

      {/* [2] 이번 달 가계부 요약 — 상세는 거래 탭 */}
      <Card radius="lg">
        <Group justify="space-between" align="center" mb="sm">
          <Text size="sm" fw={700}>
            이번 달
          </Text>
          <Anchor
            component={Link}
            href={`/${routeParams.locale}/transactions`}
            size="xs"
            fw={600}
            c="dimmed"
          >
            거래 전체 →
          </Anchor>
        </Group>
        <SimpleGrid cols={3} spacing="sm">
          <Stack gap={2}>
            <Text size="xs" c="dimmed" fw={500}>
              수입
            </Text>
            <Text
              size="md"
              fw={700}
              c="info.5"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {fmt(income)}
            </Text>
          </Stack>
          <Stack gap={2}>
            <Text size="xs" c="dimmed" fw={500}>
              지출
            </Text>
            <Text
              size="md"
              fw={700}
              c="danger.5"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {fmt(expense)}
            </Text>
          </Stack>
          <Stack gap={2}>
            <Text size="xs" c="dimmed" fw={500}>
              저축률
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

      {/* [3] 자산군 배분 도넛 */}
      {allocationItems.length > 0 && (
        <Card radius="lg">
          <Group justify="space-between" align="center" mb="sm">
            <Text size="sm" fw={700}>
              자산 구성
            </Text>
            <Anchor
              component={Link}
              href={`/${routeParams.locale}/wealth`}
              size="xs"
              fw={600}
              c="dimmed"
            >
              자산 상세 →
            </Anchor>
          </Group>
          <PortfolioDonut items={allocationItems} />
        </Card>
      )}

      {/* [4] 투자 요약 — 투자 계좌 있을 때만 */}
      {hasInvestment && (
        <Card radius="lg">
          <Group justify="space-between" align="center" mb="sm">
            <Text size="sm" fw={700}>
              투자
            </Text>
            <Anchor
              component={Link}
              href={`/${routeParams.locale}/invest`}
              size="xs"
              fw={600}
              c="dimmed"
            >
              투자 →
            </Anchor>
          </Group>
          <Group justify="space-between" align="end">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={500}>
                평가금액
              </Text>
              <Text
                size="lg"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(summary.totalValuation)}원
              </Text>
            </Stack>
            <Stack gap={2} align="end">
              <Text size="xs" c="dimmed" fw={500}>
                평가손익
              </Text>
              <Text
                size="md"
                fw={700}
                c={profitColor(summary.totalProfit)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatProfitAmount(summary.totalProfit, fmt)}원 (
                {formatProfitRate(summary.totalRate)})
              </Text>
            </Stack>
          </Group>
        </Card>
      )}

      {/* [5] 최근 거래 */}
      <Stack gap="xs">
        <Group justify="space-between" align="center" px={4}>
          <Text size="sm" fw={700}>
            최근 거래
          </Text>
          <Anchor
            component={Link}
            href={`/${routeParams.locale}/transactions`}
            size="xs"
            fw={600}
            c="dimmed"
          >
            전체 →
          </Anchor>
        </Group>
        <Card radius="lg" p="xs">
          {txns.length === 0 ? (
            <Center py="lg">
              <Text c="dimmed" size="sm">
                이번 달 거래 내역이 없어요
              </Text>
            </Center>
          ) : (
            <Stack gap={0}>
              {txns.slice(0, 5).map((t) => (
                <TxRow key={t.transactionId} t={t} />
              ))}
            </Stack>
          )}
        </Card>
      </Stack>
    </Stack>
  );
}
