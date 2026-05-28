"use client";

import {
  ActionIcon,
  Anchor,
  Card,
  Center,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronRight,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import IconBox from "_features/common/components/icon-box";
import TxRow from "_features/transaction/components/tx-row";
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

export default function HomeSection() {
  const routeParams = useParams<{ locale: string }>();
  const [hidden, setHidden] = useState(true);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { data: overviewRes } = useSuspenseQuery(
    queryKeys.home.overview({ year: currentYear, month: currentMonth }),
  );
  const overview = overviewRes.body.data;
  const txns = overview.recentTransactions;
  const stats = overview.stats;
  const totalAssets = overview.totalBalance;
  const income = stats.monthlyIncome;
  const expense = stats.monthlyExpense;
  const save = income - expense;
  const savingRate = income > 0 ? (save / income) * 100 : 0;

  // 상위 5개 지출 카테고리 + 합계
  const topExpenseCategories = stats.byCategory
    .filter((c) => !c.isIncome)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  const totalCatExpense = topExpenseCategories.reduce(
    (s, c) => s + c.amount,
    0,
  );

  return (
    <Stack gap="md">
      {/* 총자산 hero — 클릭 시 blur 토글 (프라이버시) */}
      <Card radius="xl" p="xl" shadow="md">
        <Stack gap={4}>
          <Group justify="space-between" align="center">
            <Text size="xs" fw={500} c="dimmed">
              총 자산
            </Text>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => setHidden((v) => !v)}
              aria-label={hidden ? "show amount" : "hide amount"}
            >
              {hidden ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </ActionIcon>
          </Group>
          <Text
            size="2rem"
            fw={800}
            style={{
              fontVariantNumeric: "tabular-nums",
              filter: hidden ? "blur(10px)" : "none",
              transition: "filter 0.2s ease",
              userSelect: hidden ? "none" : "auto",
              cursor: hidden ? "pointer" : "default",
            }}
            onClick={() => hidden && setHidden(false)}
          >
            {fmt(totalAssets)}
            <Text span size="lg" c="dimmed" ml={4} fw={600}>
              원
            </Text>
          </Text>
          <Anchor
            component={Link}
            href={`/${routeParams.locale}/wealth`}
            size="xs"
            fw={700}
            c="info.5"
            mt={4}
          >
            <Group gap={2}>
              자세히 보기
              <IconChevronRight size={12} />
            </Group>
          </Anchor>
        </Stack>
      </Card>

      {/* 수입/지출 2컬럼 */}
      <SimpleGrid cols={2} spacing="sm">
        <Card radius="lg">
          <Stack gap={4}>
            <Group gap={4}>
              <IconArrowDown size={12} stroke={3} color="#3B82F6" />
              <Text size="xs" fw={500} c="dimmed">
                수입
              </Text>
            </Group>
            <Text
              size="lg"
              fw={700}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {fmt(income)}
              <Text span size="xs" ml={2} fw={600} c="dimmed">
                원
              </Text>
            </Text>
          </Stack>
        </Card>
        <Card radius="lg">
          <Stack gap={4}>
            <Group gap={4}>
              <IconArrowUp size={12} stroke={3} color="#EF4444" />
              <Text size="xs" fw={500} c="dimmed">
                지출
              </Text>
            </Group>
            <Text
              size="lg"
              fw={700}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {fmt(expense)}
              <Text span size="xs" ml={2} fw={600} c="dimmed">
                원
              </Text>
            </Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* 저축 / 저축률 */}
      <Card radius="lg">
        <Group justify="space-between">
          <Stack gap={2}>
            <Text size="xs" fw={500} c="dimmed">
              이번 달 저축
            </Text>
            <Text
              size="lg"
              fw={700}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {fmt(save)}원
            </Text>
          </Stack>
          <Stack gap={2} align="end">
            <Text size="xs" fw={500} c="dimmed">
              저축률
            </Text>
            <Text
              size="lg"
              fw={700}
              c="info.5"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {savingRate.toFixed(0)}%
            </Text>
          </Stack>
        </Group>
      </Card>

      {/* 카테고리 Top5 + 최근 거래 — 데스크탑(>=lg) 에서 좌/우 (높이 일치) */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        {/* 카테고리별 지출 Top5 */}
        <Stack gap="xs" h="100%">
          <Group justify="space-between" align="center" px={4}>
            <Text size="sm" fw={700}>
              이번 달 지출
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
          <Card style={{ flex: 1 }}>
            {topExpenseCategories.length === 0 ? (
              <Center py="md">
                <Text c="dimmed" size="sm">
                  이번 달 지출이 없어요
                </Text>
              </Center>
            ) : (
              <Stack gap="sm">
                {topExpenseCategories.map((c) => {
                  const pct =
                    totalCatExpense > 0
                      ? (c.amount / totalCatExpense) * 100
                      : 0;
                  return (
                    <Stack key={c.categoryId} gap={6}>
                      <Group justify="space-between">
                        <Group gap={10} wrap="nowrap">
                          <IconBox icon={c.icon} color={c.color} size={32} />
                          <Text size="sm" fw={600}>
                            {c.name}
                          </Text>
                        </Group>
                        <Text
                          size="sm"
                          fw={700}
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {fmt(c.amount)}원
                        </Text>
                      </Group>
                      <Progress
                        value={pct}
                        size="xs"
                        radius="xl"
                        color={c.color ? undefined : "gray"}
                        style={
                          c.color
                            ? {
                                ["--progress-color" as string]: c.color,
                              }
                            : undefined
                        }
                      />
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </Card>
        </Stack>

        {/* 최근 거래 */}
        <Stack gap="xs" h="100%">
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
          <Card radius="lg" p="xs" style={{ flex: 1 }}>
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
      </SimpleGrid>
    </Stack>
  );
}
