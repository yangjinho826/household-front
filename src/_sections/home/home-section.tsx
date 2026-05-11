"use client";

import {
  Anchor,
  Card,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { HouseholdSwitcher } from "_features/household/components/household-switcher";
import { useHouseholdStore } from "_features/household/store";
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

const SIGN: Record<string, string> = {
  EXPENSE: "-",
  INCOME: "+",
  TRANSFER: "→",
};

const TX_COLOR: Record<string, string> = {
  EXPENSE: "tossRed.5",
  INCOME: "tossGreen.5",
  TRANSFER: "tossPurple.5",
};

export default function HomeSection() {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const [switcherOpened, switcher] = useDisclosure(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { data: hData } = useSuspenseQuery(
    queryKeys.household.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: aData } = useSuspenseQuery(
    queryKeys.account.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: tData } = useSuspenseQuery(
    queryKeys.transaction.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: statsData } = useSuspenseQuery(
    queryKeys.stats.monthly({ year: currentYear, month: currentMonth }),
  );

  const households = hData.body.data.content;
  const accounts = aData.body.data.content;
  const txns = tData.body.data.content;
  const stats = statsData.body.data;

  const currentId = useHouseholdStore((s) => s.currentHouseholdId);
  const currentHousehold =
    households.find((h) => h.householdId === currentId) ?? households[0];

  const totalAssets = accounts.reduce((sum, a) => sum + a.balance, 0);
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
      {/* 가계부 스위처 트리거 */}
      <UnstyledButton
        onClick={switcher.open}
        style={{ padding: "4px 8px", borderRadius: 12 }}
      >
        <Group gap={6} wrap="nowrap">
          <Text size="lg" fw={800} truncate>
            {currentHousehold?.name ?? "가계부"}
          </Text>
          <IconChevronDown size={16} color="#8B95A1" />
          {households.length > 1 && (
            <Text
              size="10px"
              fw={700}
              c="dimmed"
              px={6}
              py={2}
              style={{
                background: "var(--mantine-color-gray-1)",
                borderRadius: 999,
              }}
            >
              {households.length}
            </Text>
          )}
        </Group>
      </UnstyledButton>

      <HouseholdSwitcher
        opened={switcherOpened}
        onClose={switcher.close}
      />

      {/* 총자산 hero */}
      <Card radius="xl" p="lg">
        <Stack gap={4}>
          <Text size="xs" fw={500} c="dimmed">
            총 자산
          </Text>
          <Text
            size="2rem"
            fw={800}
            style={{ fontVariantNumeric: "tabular-nums" }}
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
            c="tossBlue.5"
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
              <IconArrowDown size={12} stroke={3} color="#3182F6" />
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
              <IconArrowUp size={12} stroke={3} color="#F04452" />
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
              size="xl"
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
              c="tossBlue.5"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {savingRate.toFixed(0)}%
            </Text>
          </Stack>
        </Group>
      </Card>

      {/* 이번 달 카테고리별 지출 */}
      {topExpenseCategories.length > 0 && (
        <>
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
          <Card radius="lg">
            <Stack gap="sm">
              {topExpenseCategories.map((c) => {
                const pct =
                  totalCatExpense > 0 ? (c.amount / totalCatExpense) * 100 : 0;
                const dotColor = c.color ?? "var(--mantine-color-gray-5)";
                return (
                  <Stack key={c.categoryId} gap={6}>
                    <Group justify="space-between">
                      <Group gap={8} wrap="nowrap">
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: c.color ? `${c.color}20` : "var(--mantine-color-gray-1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              background: dotColor,
                            }}
                          />
                        </div>
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
          </Card>
        </>
      )}

      {/* 최근 거래 */}
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
        <Stack gap={0}>
          {txns.slice(0, 5).map((t) => (
            <UnstyledButton
              key={t.transactionId}
              onClick={() =>
                router.push(
                  `/${routeParams.locale}/transactions/${t.transactionId}`,
                )
              }
              style={{ padding: 12, borderRadius: 12 }}
            >
              <Group justify="space-between">
                <Stack gap={2}>
                  <Text size="sm" fw={600}>
                    {t.memo || t.categoryName || "거래"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {t.categoryName ?? "—"} · {t.accountName ?? "—"}
                  </Text>
                </Stack>
                <Text
                  fw={700}
                  c={TX_COLOR[t.txType]}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {SIGN[t.txType] ?? ""}
                  {fmt(t.amount)}원
                </Text>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
