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
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import { accountSnapshotMockStore } from "_features/account-snapshot/mock";
import type { AccountType } from "_features/account/types";
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

const TYPE_LABEL: Record<AccountType, string> = {
  checking: "입출금",
  savings: "예적금",
  credit: "신용카드",
  cash: "현금",
  investment: "투자",
};

const TYPE_COLOR: Record<AccountType, string> = {
  checking: "tossBlue",
  savings: "tossGreen",
  credit: "tossRed",
  cash: "gray",
  investment: "tossPurple",
};

export default function WealthSection() {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const { data } = useSuspenseQuery(
    queryKeys.account.list({ pageNo: 1, listSize: 100 }),
  );
  // snapshot list 받아오고 클라에서 월별 합산 (mock 단계)
  useSuspenseQuery(queryKeys.accountSnapshot.list({}));

  const accounts = data.body.data.content;
  const total = accounts.reduce((sum, a) => sum + a.startBalance, 0);

  const trendData = useMemo(
    () =>
      accountSnapshotMockStore.aggregateByMonth().map((m) => ({
        month: m.month.slice(5) + "월",
        value: m.total,
      })),
    [],
  );

  const byType = useMemo(() => {
    const types: AccountType[] = [
      "checking",
      "savings",
      "investment",
      "credit",
      "cash",
    ];
    return types
      .map((type) => {
        const accs = accounts.filter((a) => a.accountType === type);
        const sum = accs.reduce((s, a) => s + a.startBalance, 0);
        const pct = total > 0 ? (sum / total) * 100 : 0;
        return { type, sum, accs, pct };
      })
      .filter((t) => t.accs.length > 0);
  }, [accounts, total]);

  return (
    <Stack gap="md">
      <Title order={3}>자산</Title>

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
                  tick={{ fontSize: 10, fill: "#8B95A1" }}
                  axisLine={false}
                  tickLine={false}
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
                  c={a.startBalance < 0 ? "tossRed.5" : undefined}
                >
                  {fmt(a.startBalance)}원
                </Text>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
