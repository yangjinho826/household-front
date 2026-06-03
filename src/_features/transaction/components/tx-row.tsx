"use client";

import { Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useRouter, useParams } from "next/navigation";

import IconBox from "_features/common/components/icon-box";
import { useMoney } from "_features/common/hooks/use-money";
import { TOKEN } from "_styles/design-tokens";

import type { TransactionListItemType, TxType } from "../types";

const SIGN: Record<TxType, string> = {
  EXPENSE: "-",
  FIXED_EXPENSE: "-",
  INCOME: "+",
  TRANSFER: "→",
};

const TYPE_COLOR: Record<TxType, string> = {
  EXPENSE: "danger.5",
  FIXED_EXPENSE: "danger.5",
  INCOME: "info.5",
  TRANSFER: "purple.5",
};

// 카테고리 색상 없을 때 tx_type 기준 fallback
const TYPE_FALLBACK_HEX: Record<TxType, string> = {
  EXPENSE: TOKEN.red,
  FIXED_EXPENSE: TOKEN.red,
  INCOME: TOKEN.blue,
  TRANSFER: TOKEN.purple,
};

export default function TxRow({ t }: { t: TransactionListItemType }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const money = useMoney();

  const accent = t.categoryColor ?? TYPE_FALLBACK_HEX[t.txType];

  return (
    <UnstyledButton
      onClick={() =>
        router.push(`/${params.locale}/transactions/${t.transactionId}`)
      }
      style={{ padding: 12, borderRadius: 12, display: "block" }}
    >
      <Group justify="space-between" gap="md" wrap="nowrap" align="center">
        <Group gap={12} wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
          <IconBox icon={t.categoryIcon} color={accent} />
          <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
            <Text size="sm" fw={600} truncate>
              {t.memo || t.categoryName || "거래"}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {t.categoryName ?? "—"} · {t.accountName ?? "—"}
              {t.toAccountName ? ` → ${t.toAccountName}` : ""}
            </Text>
          </Stack>
        </Group>
        <Text
          fw={800}
          c={TYPE_COLOR[t.txType]}
          style={{
            fontVariantNumeric: "tabular-nums",
            flexShrink: 0,
          }}
        >
          {SIGN[t.txType]}
          {money(t.amount)}
        </Text>
      </Group>
    </UnstyledButton>
  );
}
