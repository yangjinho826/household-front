"use client";

import { Card, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";

import type { AccountListItemType } from "_features/account/types";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";
import type { PortfolioListItemType } from "_features/portfolio/types";
import { fmt } from "_utilities/fmt";

interface Props {
  account: AccountListItemType;
  portfolios: PortfolioListItemType[];
}

export default function InvestmentAccountCard({ account, portfolios }: Props) {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  // 백엔드가 통장 balance = cash + portfolio_valuation 으로 합산. 디테일 hero 와 동일 데이터 소스
  const profitLoss = account.portfolioProfitLoss ?? 0;
  const profitLossRate = account.portfolioProfitLossRate ?? 0;
  const cash = account.cash ?? 0;
  const valuation = account.portfolioValuation ?? 0;

  return (
    <UnstyledButton
      onClick={() =>
        router.push(`/${routeParams.locale}/wealth/account/${account.accountId}`)
      }
      style={{ width: "100%" }}
    >
      <Card radius="lg" p="md">
        <Stack gap={8}>
          <Group justify="space-between" align="center">
            <Group gap={6}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: account.color
                    ? `${account.color}20`
                    : "var(--mantine-color-purple-0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: account.color ?? "var(--mantine-color-purple-5)",
                }}
              >
                {account.name.slice(0, 1)}
              </div>
              <Text size="sm" fw={700}>
                {account.name}
              </Text>
            </Group>
            <IconChevronRight size={14} color="#8B95A1" />
          </Group>

          <Stack gap={2}>
            <Text
              size="xl"
              fw={800}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {fmt(account.balance)}
              <Text span size="sm" c="dimmed" ml={4} fw={600}>
                원
              </Text>
            </Text>
            <Group gap={4}>
              <Text
                size="xs"
                fw={700}
                c={profitColor(profitLoss)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatProfitAmount(profitLoss, fmt)}원
              </Text>
              <Text
                size="xs"
                fw={700}
                c={profitColor(profitLoss)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                ({formatProfitRate(profitLossRate)})
              </Text>
            </Group>
          </Stack>

          <Group gap={12} mt={4}>
            <Group gap={4}>
              <Text size="10px" c="dimmed" fw={600}>
                현금
              </Text>
              <Text
                size="10px"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(cash)}원
              </Text>
            </Group>
            <Text size="10px" c="dimmed">·</Text>
            <Group gap={4}>
              <Text size="10px" c="dimmed" fw={600}>
                평가
              </Text>
              <Text
                size="10px"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(valuation)}원
              </Text>
            </Group>
            <Text size="10px" c="dimmed">·</Text>
            <Group gap={4}>
              <Text size="10px" c="dimmed" fw={600}>
                종목
              </Text>
              <Text
                size="10px"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {portfolios.length}개
              </Text>
            </Group>
          </Group>
        </Stack>
      </Card>
    </UnstyledButton>
  );
}
