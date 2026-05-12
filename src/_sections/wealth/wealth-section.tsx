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
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import { useAccountSnapshotMutations } from "_features/account-snapshot/queries/use-mutations";
import type { AccountListItemType, AccountType } from "_features/account/types";
import { queryKeys } from "_constants/queries";
import { getErrorMessage } from "_libraries/fetch/error-message";
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
  const te = useTranslations("error");

  const { data: accountData } = useSuspenseQuery(
    queryKeys.account.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: snapshotData } = useSuspenseQuery(
    queryKeys.accountSnapshot.yearly({}),
  );

  const { createMutation } = useAccountSnapshotMutations();

  // 백엔드 account.balance 는 INVESTMENT 도 cash + 평가금 합산해서 내려옴
  const accounts: AccountListItemType[] = accountData.body.data.content;
  const yearly = snapshotData.body.data;

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

  const hasTargetMonth = yearly.targetMonthSaved;
  const targetMonthLabel = `${Number(yearly.targetMonthDate.slice(5, 7))}월`;

  const handleTakeSnapshot = () => {
    if (hasTargetMonth || createMutation.isPending) return;
    modals.openConfirmModal({
      centered: true,
      title: `${targetMonthLabel} 자산 기록`,
      labels: { confirm: "기록하기", cancel: "취소" },
      children: (
        <Text size="sm">
          {targetMonthLabel} 자산 스냅샷을 저장할까요?
          <br />
          모든 통장의 현재 잔액이 기록됩니다.
        </Text>
      ),
      onConfirm: async () => {
        try {
          await createMutation.mutateAsync();
          notifications.show({
            title: "기록 완료",
            message: `${targetMonthLabel} 자산이 기록되었습니다.`,
            color: "green",
          });
        } catch (error) {
          notifications.show({
            title: "기록 실패",
            message: getErrorMessage(error, te),
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
              disabled={hasTargetMonth || createMutation.isPending}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: hasTargetMonth
                  ? "var(--mantine-color-gray-0)"
                  : "var(--mantine-color-tossBlue-0)",
                opacity: createMutation.isPending ? 0.5 : 1,
              }}
            >
              <Group gap={4} wrap="nowrap">
                {hasTargetMonth ? (
                  <IconCheck size={12} stroke={3} color="#8B95A1" />
                ) : (
                  <IconPlus size={12} stroke={3} color="#3182F6" />
                )}
                <Text
                  size="10px"
                  fw={700}
                  c={hasTargetMonth ? "dimmed" : "tossBlue.5"}
                >
                  {hasTargetMonth
                    ? `${targetMonthLabel} 저장됨`
                    : `${targetMonthLabel} 자산 기록`}
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
          <ResponsiveContainer width="100%" height={96} minWidth={0}>
            <AreaChart
              data={trendData}
              margin={{ top: 12, right: 0, bottom: 0, left: 0 }}
            >
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
          통장 ({accounts.length})
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
          {accounts.map((a) => (
            <UnstyledButton
              key={a.accountId}
              onClick={() => {
                // INVESTMENT 는 포트폴리오 디테일로, 그 외는 일반 통장 디테일로
                const path =
                  a.accountType === "INVESTMENT"
                    ? `/wealth/account/${a.accountId}`
                    : `/account/${a.accountId}`;
                router.push(`/${routeParams.locale}${path}`);
              }}
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
