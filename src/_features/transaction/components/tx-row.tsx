"use client";

import { Badge, Group, Stack, Text, UnstyledButton } from "@mantine/core";
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
  const tTxType = useTranslations("enum.tx-type");
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

  // 고정지출은 어떤 항목(월세/통신비…)인지가 카테고리보다 중요 — 제목에 이름을 올린다.
  const isFixedExpense = item.txType === "FIXED_EXPENSE";
  const title =
    item.memo ||
    (isFixedExpense ? item.fixedExpenseName : null) ||
    item.categoryName ||
    t("tx_default_label");
  // 제목이 이미 고정지출명이면(메모 없음/메모=항목명) 서브라인엔 카테고리를 —
  // 같은 이름을 두 줄에 반복하면 한 줄을 통째로 버리는 셈이다.
  const subLabel = isFixedExpense
    ? (item.fixedExpenseName && item.fixedExpenseName !== title
        ? item.fixedExpenseName
        : (item.categoryName ?? "—"))
    : (item.categoryName ?? "—");

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
              {title}
            </Text>
            <Group gap={4} wrap="nowrap" style={{ minWidth: 0 }}>
              {isFixedExpense && (
                <Badge size="xs" color="danger" variant="light" radius="sm">
                  {tTxType("FIXED_EXPENSE")}
                </Badge>
              )}
              <Text size="xs" c="dimmed" truncate>
                {subLabel} · {item.accountName ?? "—"}
                {item.toAccountName ? ` → ${item.toAccountName}` : ""}
              </Text>
            </Group>
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
