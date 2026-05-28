"use client";

import {
  Card,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import SubHeader from "_features/layout/components/sub-header";
import PortfolioDonut from "_features/portfolio/components/portfolio-donut";
import { useAccountOverview } from "_features/portfolio/queries/use-query";
import {
  formatProfitAmount,
  formatProfitRate,
  pickPortfolioColor,
  profitColor,
} from "_features/portfolio/utils";
import { fmt } from "_utilities/fmt";

interface Props {
  accountId: string;
}

export default function AccountPortfolioSection({ accountId }: Props) {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const tMarket = useTranslations("enum.market");

  const { data } = useAccountOverview(accountId);
  const account = data.body.data.account;
  // 백엔드 응답에 isArchived 포함 — 활성 종목만 노출
  const portfolios = useMemo(
    () => data.body.data.portfolios.filter((p) => !p.isArchived),
    [data],
  );

  const stockBreakdown = useMemo(
    () =>
      portfolios.map((p) => ({
        key: p.portfolioId,
        label: p.name,
        value: p.currentValue,
        color: pickPortfolioColor(p.name),
      })),
    [portfolios],
  );

  // 백엔드가 통장 balance = cash + portfolio_valuation 으로 합산해서 내려줌
  const profitLoss = account.portfolioProfitLoss ?? 0;
  const profitLossRate = account.portfolioProfitLossRate ?? 0;
  const cash = account.cash;
  const valuation = account.portfolioValuation;

  return (
    <Stack gap="md">
      <SubHeader title={account.name} />

      {/* hero — 통장 전체 자산 + 손익 + 현금/평가/종목 메타 */}
      <Card radius="xl" p="xl" shadow="md">
        <Stack gap={4}>
          <Text size="xs" fw={500} c="dimmed">
            통장 전체 자산
          </Text>
          <Text
            size="2rem"
            fw={800}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(account.balance)}
            <Text span size="lg" c="dimmed" ml={4} fw={600}>
              원
            </Text>
          </Text>
          <Group gap={6}>
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
          <Group gap={12} mt={6}>
            <Group gap={4}>
              <Text size="11px" c="dimmed" fw={600}>
                현금
              </Text>
              <Text
                size="11px"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(cash ?? 0)}원
              </Text>
            </Group>
            <Text size="11px" c="dimmed">·</Text>
            <Group gap={4}>
              <Text size="11px" c="dimmed" fw={600}>
                평가
              </Text>
              <Text
                size="11px"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(valuation ?? 0)}원
              </Text>
            </Group>
            <Text size="11px" c="dimmed">·</Text>
            <Group gap={4}>
              <Text size="11px" c="dimmed" fw={600}>
                종목
              </Text>
              <Text
                size="11px"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {portfolios.length}개
              </Text>
            </Group>
          </Group>
        </Stack>
      </Card>

      {/* 종목별 비중 — 보유 종목이 1개 이상일 때만 */}
      {stockBreakdown.length > 0 && (
        <Card radius="xl" p="md">
          <Stack gap={6}>
            <Text size="xs" fw={500} c="dimmed" px={4}>
              종목별 비중
            </Text>
            <PortfolioDonut items={stockBreakdown} />
          </Stack>
        </Card>
      )}

      {/* 보유 종목 */}
      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          보유 종목
        </Text>
        <UnstyledButton
          onClick={() => router.push(`/${routeParams.locale}/portfolio/new`)}
        >
          <Text size="xs" fw={700} c="info.5">
            + 종목 추가
          </Text>
        </UnstyledButton>
      </Group>

      {portfolios.length === 0 ? (
        <Card radius="lg" p="xl">
          <Text size="sm" c="dimmed" ta="center">
            보유 종목이 없습니다
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
                    `/${routeParams.locale}/wealth/portfolio/${p.portfolioId}`,
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
                        {p.code} · {tMarket(p.market)} · {p.quantity}주
                      </Text>
                      <Group gap={4} mt={4}>
                        <Text size="10px" c="dimmed" fw={600}>
                          평균
                        </Text>
                        <Text
                          size="10px"
                          fw={700}
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {fmt(p.avgPrice)}원
                        </Text>
                      </Group>
                    </Stack>
                    <Stack gap={2} align="flex-end">
                      <Text
                        size="sm"
                        fw={700}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {fmt(p.currentValue)}원
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
                      <IconChevronRight size={12} color="#8B95A1" />
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
