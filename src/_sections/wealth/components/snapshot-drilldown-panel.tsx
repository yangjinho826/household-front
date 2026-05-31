"use client";

import { Card, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import type { AccountSnapshotMonthItem } from "_features/account-snapshot/types";
import { fmt } from "_utilities/fmt";

interface Props {
  month: AccountSnapshotMonthItem;
  onClose: () => void;
}

// 추이 차트의 한 달을 탭하면 그달 총자산을 계좌별로 분해해서 보여줌
export default function SnapshotDrilldownPanel({ month, onClose }: Props) {
  const monthLabel = `${Number(month.snapshotDate.slice(5, 7))}월`;
  // 잔액 큰 통장부터 — 기여도 큰 순
  const accounts = [...month.accounts].sort((a, b) => b.balance - a.balance);

  return (
    <Card radius="lg" p="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={700}>
            {monthLabel} 자산 분해
          </Text>
          <UnstyledButton onClick={onClose} aria-label="닫기">
            <IconX size={16} color="#8B95A1" />
          </UnstyledButton>
        </Group>

        {/* 그달 총자산 + 수입/지출 흐름 */}
        <Card radius="md" p="sm" style={{ background: "var(--mantine-color-gray-0)" }}>
          <Stack gap={6}>
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                총자산
              </Text>
              <Text
                size="sm"
                fw={800}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(month.totalBalance)}원
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                수입
              </Text>
              <Text
                size="xs"
                fw={600}
                c="linerGreen.6"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                +{fmt(month.totalIncome)}원
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="xs" c="dimmed">
                지출
              </Text>
              <Text
                size="xs"
                fw={600}
                c="danger.5"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                −{fmt(month.totalExpense)}원
              </Text>
            </Group>
          </Stack>
        </Card>

        {/* 계좌별 잔액 */}
        <Stack gap={8}>
          {accounts.map((a) => (
            <Group key={a.accountId} justify="space-between" wrap="nowrap">
              <Text size="sm" fw={600} truncate style={{ minWidth: 0 }}>
                {a.accountName}
              </Text>
              <Text
                size="sm"
                fw={700}
                c={a.balance < 0 ? "danger.5" : undefined}
                style={{ fontVariantNumeric: "tabular-nums", flexShrink: 0 }}
              >
                {fmt(a.balance)}원
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
