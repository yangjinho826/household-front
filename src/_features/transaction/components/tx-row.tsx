"use client";

import { Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useRouter, useParams } from "next/navigation";

import { fmt } from "_utilities/fmt";

import type { TransactionListItemType, TxType } from "../types";

const SIGN: Record<TxType, string> = {
  EXPENSE: "-",
  INCOME: "+",
  TRANSFER: "→",
};

const TYPE_COLOR: Record<TxType, string> = {
  EXPENSE: "tossRed.5",
  INCOME: "tossGreen.5",
  TRANSFER: "tossPurple.5",
};

export default function TxRow({ t }: { t: TransactionListItemType }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();

  return (
    <UnstyledButton
      onClick={() =>
        router.push(`/${params.locale}/transactions/${t.transactionId}`)
      }
      style={{
        padding: "12px",
        borderRadius: 12,
        display: "block",
      }}
    >
      <Group justify="space-between" gap="md" wrap="nowrap">
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Text size="sm" fw={600} truncate>
            {t.memo || t.categoryName || "거래"}
          </Text>
          <Text size="xs" c="dimmed" truncate>
            {t.categoryName ?? "—"} · {t.accountName ?? "—"}
            {t.toAccountName ? ` → ${t.toAccountName}` : ""}
          </Text>
        </Stack>
        <Text
          fw={700}
          c={TYPE_COLOR[t.txType]}
          style={{
            fontVariantNumeric: "tabular-nums",
            flexShrink: 0,
          }}
        >
          {SIGN[t.txType]}
          {fmt(t.amount)}원
        </Text>
      </Group>
    </UnstyledButton>
  );
}
