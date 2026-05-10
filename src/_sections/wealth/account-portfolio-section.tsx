"use client";

import {
  ActionIcon,
  Card,
  Group,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";

import {
  formatProfitAmount,
  formatProfitRate,
  portfolioCalc,
  profitColor,
} from "_features/portfolio/utils";
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

interface Props {
  accountId: string;
}

export default function AccountPortfolioSection({ accountId }: Props) {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const { data: accountData } = useSuspenseQuery(
    queryKeys.account.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: portfolioData } = useSuspenseQuery(
    queryKeys.portfolio.list({ pageNo: 1, listSize: 200 }),
  );

  const account = accountData.body.data.content.find(
    (a) => a.accountId === accountId,
  );
  const portfolios = useMemo(
    () =>
      portfolioData.body.data.content.filter(
        (p) => p.accountId === accountId && !p.isArchived,
      ),
    [portfolioData, accountId],
  );

  const stat = portfolioCalc(portfolios);

  if (!account) {
    return (
      <Stack gap="md">
        <Text c="dimmed">계좌를 찾을 수 없습니다.</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Group gap={4} align="center">
        <ActionIcon
          variant="subtle"
          onClick={() => router.back()}
          aria-label="back"
        >
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Title order={3}>{account.name}</Title>
      </Group>

      {/* hero */}
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
            <Group gap={4}>
              <Text size="11px" c="dimmed" fw={600}>
                보유종목
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

      {/* 보유 종목 */}
      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          보유 종목
        </Text>
        <UnstyledButton
          onClick={() => router.push(`/${routeParams.locale}/portfolio/new`)}
        >
          <Text size="xs" fw={700} c="tossBlue.5">
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
                        {p.ticker}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {p.symbol ?? "—"} · {p.quantity}주
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
