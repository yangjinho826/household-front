"use client";

import {
  Card,
  Group,
  Progress,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import { useAccountSnapshotMutations } from "_features/account-snapshot/queries/use-mutations";
import type { AccountType } from "_features/account/types";
import { queryKeys } from "_constants/queries";
import { ApiResponseError } from "_libraries/fetch/api-response-error";
import { fmt } from "_utilities/fmt";

const TYPE_LABEL: Record<AccountType, string> = {
  LIVING: "생활",
  SAVINGS: "적립",
  INVESTMENT: "투자",
};

const TYPE_COLOR: Record<AccountType, string> = {
  LIVING: "tossBlue",
  SAVINGS: "tossGreen",
  INVESTMENT: "tossPurple",
};

export default function WealthSection() {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const { data: accountData } = useSuspenseQuery(
    queryKeys.account.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: portfolioData } = useSuspenseQuery(
    queryKeys.portfolio.list({ pageNo: 1, listSize: 200 }),
  );
  const { data: snapshotData } = useSuspenseQuery(
    queryKeys.accountSnapshot.yearly({}),
  );

  const { createMutation } = useAccountSnapshotMutations();

  const rawAccounts = accountData.body.data.content;
  const portfolios = portfolioData.body.data.content;
  const yearly = snapshotData.body.data;

  // 투자 계좌의 balance 는 portfolio currentValue 합으로 derive (mock 단계)
  const accounts = useMemo(() => {
    return rawAccounts.map((a) => {
      if (a.accountType !== "INVESTMENT") return a;
      const owned = portfolios.filter((p) => p.accountId === a.accountId);
      const investValue = owned.reduce((s, p) => s + p.currentValue, 0);
      return { ...a, balance: investValue };
    });
  }, [rawAccounts, portfolios]);

  const generalAccounts = useMemo(
    () => accounts.filter((a) => a.accountType !== "INVESTMENT"),
    [accounts],
  );

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  const trendData = useMemo(
    () =>
      yearly.months.map((m) => ({
        month: `${Number(m.snapshotDate.slice(5, 7))}월`, // "5월"
        value: m.totalBalance,
      })),
    [yearly.months],
  );

  const byType = useMemo(() => {
    const types: AccountType[] = ["LIVING", "SAVINGS", "INVESTMENT"];
    return types
      .map((type) => {
        const accs = accounts.filter((a) => a.accountType === type);
        const sum = accs.reduce((s, a) => s + a.balance, 0);
        const pct = total > 0 ? (sum / total) * 100 : 0;
        return { type, sum, accs, pct };
      })
      .filter((t) => t.accs.length > 0);
  }, [accounts, total]);

  const hasThisMonth = yearly.currentMonthSaved;
  const thisMonthLabel = `${Number(yearly.currentMonthDate.slice(5, 7))}월`;

  const handleTakeSnapshot = () => {
    if (hasThisMonth || createMutation.isPending) return;
    modals.openConfirmModal({
      centered: true,
      title: `${thisMonthLabel} 자산 기록`,
      labels: { confirm: "기록하기", cancel: "취소" },
      children: (
        <Text size="sm">
          {thisMonthLabel} 자산 스냅샷을 저장할까요?
          <br />
          모든 통장의 현재 잔액이 기록됩니다.
        </Text>
      ),
      onConfirm: async () => {
        try {
          await createMutation.mutateAsync();
          notifications.show({
            title: "기록 완료",
            message: `${thisMonthLabel} 자산이 기록되었습니다.`,
            color: "green",
          });
        } catch (error) {
          const msg =
            error instanceof ApiResponseError
              ? (error.errorMessage ?? error.message)
              : error instanceof Error && error.message === "SNAPSHOT_ALREADY_EXISTS"
                ? "이번 달 자산 스냅샷은 이미 저장되었습니다"
                : error instanceof Error && error.message === "NO_ACTIVE_ACCOUNT"
                  ? "저장할 통장이 없습니다"
                  : "스냅샷 저장에 실패했습니다";
          notifications.show({
            title: "기록 실패",
            message: msg,
            color: "red",
          });
        }
      },
    });
  };

  return (
    <Stack gap="md">
      <Title order={3}>자산</Title>

      <Card radius="xl" p="lg">
        <Stack gap={4}>
          <Group justify="space-between" align="center">
            <Text size="xs" fw={500} c="dimmed">
              총 자산
            </Text>
            <UnstyledButton
              onClick={handleTakeSnapshot}
              disabled={hasThisMonth || createMutation.isPending}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: hasThisMonth
                  ? "var(--mantine-color-gray-0)"
                  : "var(--mantine-color-tossBlue-0)",
                opacity: createMutation.isPending ? 0.5 : 1,
              }}
            >
              <Group gap={4} wrap="nowrap">
                {hasThisMonth ? (
                  <IconCheck size={12} stroke={3} color="#8B95A1" />
                ) : (
                  <IconPlus size={12} stroke={3} color="#3182F6" />
                )}
                <Text
                  size="10px"
                  fw={700}
                  c={hasThisMonth ? "dimmed" : "tossBlue.5"}
                >
                  {hasThisMonth
                    ? `${thisMonthLabel} 저장됨`
                    : `${thisMonthLabel} 자산 기록`}
                </Text>
              </Group>
            </UnstyledButton>
          </Group>
          <Text
            size="2rem"
            fw={800}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(total)}
            <Text span size="lg" c="dimmed" ml={4} fw={600}>
              원
            </Text>
          </Text>
          <div style={{ height: 96, marginTop: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="wealthTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3182F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3182F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3182F6"
                  strokeWidth={2.5}
                  fill="url(#wealthTrend)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 9, fill: "#8B95A1" }}
                  axisLine={false}
                  tickLine={false}
                  interval={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Stack>
      </Card>

      <Card radius="lg">
        <Stack gap="sm">
          <Text size="sm" fw={700}>
            자산 분포
          </Text>
          <Stack gap="xs">
            {byType.map((t) => (
              <Stack key={t.type} gap={4}>
                <Group justify="space-between">
                  <Group gap={6}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: `var(--mantine-color-${TYPE_COLOR[t.type]}-5)`,
                      }}
                    />
                    <Text size="sm" fw={600}>
                      {TYPE_LABEL[t.type]}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {t.pct.toFixed(0)}%
                    </Text>
                  </Group>
                  <Text
                    size="sm"
                    fw={700}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {fmt(t.sum)}원
                  </Text>
                </Group>
                <Progress
                  value={t.pct}
                  color={TYPE_COLOR[t.type]}
                  size="xs"
                  radius="xl"
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>

      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          통장 ({generalAccounts.length})
        </Text>
        <UnstyledButton
          onClick={() => router.push(`/${routeParams.locale}/account/new`)}
        >
          <Text size="xs" fw={700} c="tossBlue.5">
            + 추가
          </Text>
        </UnstyledButton>
      </Group>

      <Card radius="lg" p="xs">
        <Stack gap={0}>
          {generalAccounts.map((a) => (
            <UnstyledButton
              key={a.accountId}
              onClick={() =>
                router.push(`/${routeParams.locale}/account/${a.accountId}`)
              }
              style={{ padding: 12, borderRadius: 12 }}
            >
              <Group gap={12}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: a.color
                      ? `${a.color}20`
                      : `var(--mantine-color-${TYPE_COLOR[a.accountType]}-0)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Text
                    size="sm"
                    fw={700}
                    style={{
                      color:
                        a.color ??
                        `var(--mantine-color-${TYPE_COLOR[a.accountType]}-5)`,
                    }}
                  >
                    {a.name.slice(0, 1)}
                  </Text>
                </div>
                <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={600} truncate>
                    {a.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {TYPE_LABEL[a.accountType] ?? a.accountType}
                  </Text>
                </Stack>
                <Text
                  size="sm"
                  fw={700}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                  c={a.balance < 0 ? "tossRed.5" : undefined}
                >
                  {fmt(a.balance)}원
                </Text>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
