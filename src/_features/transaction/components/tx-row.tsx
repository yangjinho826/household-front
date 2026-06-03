"use client";

import { Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useTranslations } from "next-intl";
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

export default function TxRow({ item }: { item: TransactionListItemType }) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const money = useMoney();
  const t = useTranslations("transaction");

  const accent = item.categoryColor ?? TYPE_FALLBACK_HEX[item.txType];

  return (
    <UnstyledButton
      onClick={() =>
        router.push(`/${params.locale}/transactions/${item.transactionId}`)
      }
      style={{ padding: 12, borderRadius: 12, display: "block" }}
    >
      <Group justify="space-between" gap="md" wrap="nowrap" align="center">
        <Group gap={12} wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
          <IconBox icon={item.categoryIcon} color={accent} />
          <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
            <Text size="sm" fw={600} truncate>
              {item.memo || item.categoryName || t("tx_default_label")}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {item.categoryName ?? "—"} · {item.accountName ?? "—"}
              {item.toAccountName ? ` → ${item.toAccountName}` : ""}
            </Text>
          </Stack>
        </Group>
        <Text
          fw={800}
          c={TYPE_COLOR[item.txType]}
          style={{
            fontVariantNumeric: "tabular-nums",
            flexShrink: 0,
          }}
        >
          {SIGN[item.txType]}
          {money(item.amount)}
        </Text>
      </Group>
    </UnstyledButton>
  );
}
