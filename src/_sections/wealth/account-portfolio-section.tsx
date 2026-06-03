"use client";

import {
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useMemo } from "react";

import SubHeader from "_features/layout/components/sub-header";
import PortfolioDonut, {
  type DonutBreakdownItem,
} from "_features/portfolio/components/portfolio-donut";
import AccountBalanceTrend from "_sections/wealth/components/account-balance-trend";
import RealizedPnlRail from "_sections/wealth/components/realized-pnl-rail";
import { useAccountOverview } from "_features/portfolio/queries/use-query";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";
import { PORTFOLIO_PALETTE, TOKEN } from "_styles/design-tokens";
import { useMoney } from "_features/common/hooks/use-money";
import { fmt } from "_utilities/fmt";

/** 종목 비중 도넛: 상위 N개만 고유색, 나머지 "기타"·현금 회색 묶음 (메인과 동일 규칙) */
const TOP_STOCKS = 5;

interface Props {
  accountId: string;
}

export default function AccountPortfolioSection({ accountId }: Props) {
  const t = useTranslations("portfolio");
  const tGeneral = useTranslations("general");
  const tMarket = useTranslations("enum.market");
  const money = useMoney();
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const { data } = useAccountOverview(accountId);
  const account = data.body.data.account;
  // 백엔드 응답에 isArchived 포함 — 활성 종목만 노출
  const portfolios = useMemo(
    () => data.body.data.portfolios.filter((p) => !p.isArchived),
    [data],
  );

  // 백엔드가 통장 balance = cash + portfolio_valuation 으로 합산해서 내려줌
  const cash = account.cash ?? 0;
  const valuation = account.portfolioValuation ?? 0;
  const profitLoss = account.portfolioProfitLoss ?? 0;
  const profitLossRate = account.portfolioProfitLossRate ?? 0;

  // 메인과 동일 규칙: 평가액 내림차순 정렬 후 Top5 PALETTE 고유색 + 기타/현금 회색
  // (같은 종목이 메인↔상세에서 같은 색이 되도록 정렬 기준·팔레트 일치)
  const stockBreakdown = useMemo<DonutBreakdownItem[]>(() => {
    const stocks = portfolios
      .filter((p) => p.currentValue > 0)
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
      });
    }
    if (cash > 0) {
      items.push({
        key: "__cash",
        label: t("cash_slice"),
        value: cash,
        color: TOKEN.warmGray,
      });
    }
    return items;
  }, [portfolios, cash, t]);

  // 손익 부호별 pill 배경 (메인 hero 패턴 — 텍스트색은 한국 주식 관습 profitColor)
  const profitBg =
    profitLoss > 0 ? "danger.0" : profitLoss < 0 ? "info.0" : "gray.1";

  return (
    <Stack gap="md">
      <SubHeader title={account.name} />

      {/* hero — 계좌 총액(현금+평가) + 평가손익 pill + 현금/평가/종목 메타 */}
      <Card radius="xl" p="xl" shadow="md">
        <Stack gap={10}>
          <Stack gap={4}>
            <Text size="xs" fw={500} c="dimmed">
              {t("account_total")}
            </Text>
            <Text
              size="2rem"
              fw={800}
              style={{ fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}
            >
              {fmt(account.balance)}
              <Text span size="lg" c="dimmed" ml={4} fw={600}>
                원
              </Text>
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
                c={profitColor(profitLoss)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatProfitAmount(profitLoss, fmt)}원
              </Text>
              <Text
                size="sm"
                fw={700}
                c={profitColor(profitLoss)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                ({formatProfitRate(profitLossRate)})
              </Text>
            </Group>
          </Stack>

          <Divider />

          <Group gap={40}>
            <Stack gap={2}>
              <Text size="11px" c="dimmed" fw={500}>
                {t("cash_label")}
              </Text>
              <Text size="sm" fw={700} style={{ fontVariantNumeric: "tabular-nums" }}>
                {money(cash)}
              </Text>
            </Stack>
            <Stack gap={2}>
              <Text size="11px" c="dimmed" fw={500}>
                {t("meta_valuation")}
              </Text>
              <Text size="sm" fw={700} style={{ fontVariantNumeric: "tabular-nums" }}>
                {money(valuation)}
              </Text>
            </Stack>
            <Stack gap={2}>
              <Text size="11px" c="dimmed" fw={500}>
                {t("meta_stock_count")}
              </Text>
              <Text size="sm" fw={700} style={{ fontVariantNumeric: "tabular-nums" }}>
                {tGeneral("unit.count", { count: portfolios.length })}
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Card>

      {/* 통장 전체 자산 추이 차트 */}
      <Suspense
        fallback={
          <Center py="md">
            <Loader size="sm" />
          </Center>
        }
      >
        <AccountBalanceTrend accountId={accountId} />
      </Suspense>

      {/* 종목 비중 — 보유 종목이 1개 이상일 때만 */}
      {stockBreakdown.length > 0 && (
        <Card radius="xl" p="md">
          <Stack gap={10}>
            <Text size="sm" fw={700} px={4}>
              {t("stock_allocation")}
            </Text>
            <PortfolioDonut items={stockBreakdown} topN={stockBreakdown.length} />
          </Stack>
        </Card>
      )}

      {/* 누적 매매수익 레일 — 도넛 다음 얇은 한 줄, 탭하면 바텀시트로 상세 (전량매도된 종목 포함) */}
      <Suspense fallback={null}>
        <RealizedPnlRail accountId={accountId} />
      </Suspense>

      {/* 보유 종목 */}
      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          {t("holdings")}
        </Text>
        <UnstyledButton
          onClick={() => router.push(`/${routeParams.locale}/invest/new`)}
        >
          <Text size="xs" fw={700} c="sage.6">
            + {t("add_stock")}
          </Text>
        </UnstyledButton>
      </Group>

      {portfolios.length === 0 ? (
        <Card radius="lg" p="xl">
          <Text size="sm" c="dimmed" ta="center">
            {t("empty_holdings")}
          </Text>
        </Card>
      ) : (
        <Stack gap="sm">
          {portfolios.map((p) => {
            const cost = p.quantity * p.avgPrice;
            const profit = p.currentValue - cost;
            const rate = cost > 0 ? (profit / cost) * 100 : 0;
            return (
              <UnstyledButton
                key={p.portfolioId}
                onClick={() =>
                  router.push(
                    `/${routeParams.locale}/invest/portfolio/${p.portfolioId}`,
                  )
                }
              >
                <Card radius="lg" p="md">
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={700} truncate>
                        {p.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {p.code} · {tMarket(p.market)} ·{" "}
                        {tGeneral("unit.stock", { count: p.quantity })}
                      </Text>
                      <Group gap={4} mt={4}>
                        <Text size="10px" c="dimmed" fw={600}>
                          {t("avg_short")}
                        </Text>
                        <Text
                          size="10px"
                          fw={700}
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {money(p.avgPrice)}
                        </Text>
                      </Group>
                    </Stack>
                    <Stack gap={2} align="flex-end">
                      <Text
                        size="sm"
                        fw={700}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {money(p.currentValue)}
                      </Text>
                      <Group gap={4}>
                        <Text
                          size="11px"
                          fw={700}
                          c={profitColor(profit)}
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {formatProfitAmount(profit, fmt)}
                        </Text>
                        <Text
                          size="11px"
                          fw={700}
                          c={profitColor(profit)}
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          ({formatProfitRate(rate)})
                        </Text>
                      </Group>
                      <IconChevronRight
                        size={12}
                        color="var(--mantine-color-gray-5)"
                      />
                    </Stack>
                  </Group>
                </Card>
              </UnstyledButton>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
