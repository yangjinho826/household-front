"use client";

import { Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useTranslations } from "next-intl";

import IconBox from "_features/common/components/icon-box";
import { useMoney } from "_features/common/hooks/use-money";
import { TOKEN } from "_styles/design-tokens";

import { useQuickAddStore } from "../store";
import type { TransactionListItemType, TxType } from "../types";

// VALUATION 은 행에서 valuationDirection 으로 부호/색을 따로 정한다(아래 값은 fallback).
const SIGN: Record<TxType, string> = {
  EXPENSE: "-",
  FIXED_EXPENSE: "-",
  INCOME: "+",
  TRANSFER: "→",
  VALUATION: "±",
};

const TYPE_COLOR: Record<TxType, string> = {
  EXPENSE: "danger.5",
  FIXED_EXPENSE: "danger.5",
  INCOME: "info.5",
  TRANSFER: "purple.5",
  VALUATION: "info.5",
};

// 카테고리 색상 없을 때 tx_type 기준 fallback
const TYPE_FALLBACK_HEX: Record<TxType, string> = {
  EXPENSE: TOKEN.red,
  FIXED_EXPENSE: TOKEN.red,
  INCOME: TOKEN.blue,
  TRANSFER: TOKEN.purple,
  VALUATION: TOKEN.purple,
};

export default function TxRow({ item }: { item: TransactionListItemType }) {
  const money = useMoney();
  const t = useTranslations("transaction");
  const openEdit = useQuickAddStore((s) => s.open);

  const accent = item.categoryColor ?? TYPE_FALLBACK_HEX[item.txType];

  // 평가조정은 방향(INCREASE/DECREASE)으로 부호·색을 정한다.
  const isValuation = item.txType === "VALUATION";
  const sign = isValuation
    ? item.valuationDirection === "DECREASE"
      ? "-"
      : "+"
    : SIGN[item.txType];
  const amountColor = isValuation
    ? item.valuationDirection === "DECREASE"
      ? "danger.5"
      : "info.5"
    : TYPE_COLOR[item.txType];

  return (
    <UnstyledButton
      onClick={() => openEdit(item.transactionId)}
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
          c={amountColor}
          style={{
            fontVariantNumeric: "tabular-nums",
            flexShrink: 0,
          }}
        >
          {sign}
          {money(item.amount)}
        </Text>
      </Group>
    </UnstyledButton>
  );
}
