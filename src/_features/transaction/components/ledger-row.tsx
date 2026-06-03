"use client";

import { Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

import IconBox from "_features/common/components/icon-box";
import { TOKEN } from "_styles/design-tokens";
import { fmt } from "_utilities/fmt";

import type { AccountLedgerItemType, TxType } from "../types";

// 카테고리 색 없을 때 tx_type 기준 fallback (tx-row 와 동일 팔레트)
const TYPE_FALLBACK_HEX: Record<TxType, string> = {
  EXPENSE: TOKEN.red,
  FIXED_EXPENSE: TOKEN.red,
  INCOME: TOKEN.blue,
  TRANSFER: TOKEN.purple,
};

/**
 * 계좌 거래 이력 한 행 — 그 계좌 관점의 부호 금액 + 그 거래 직후 잔액(running balance).
 * 이체는 이 계좌가 입금이면 +(상대=출금처), 출금이면 −(상대=입금처).
 */
export default function LedgerRow({
  t,
  accountId,
}: {
  t: AccountLedgerItemType;
  /** 지금 보고 있는 계좌 — 이체 방향 판정 기준 */
  accountId: string;
}) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const tt = useTranslations("transaction");

  const accent = t.categoryColor ?? TYPE_FALLBACK_HEX[t.txType];
  // 이체 방향은 signedAmount 부호가 아니라 계좌 매칭으로 — 0원 이체도 정확하게.
  // (이 계좌가 입금처(toAccountId)면 입금, 아니면 출금)
  const isPositive =
    t.txType === "TRANSFER" ? t.toAccountId === accountId : t.signedAmount >= 0;
  // 이체 상대 계좌 — 입금이면 출금처(accountName), 출금이면 입금처(toAccountName)
  const counterparty = isPositive ? t.accountName : t.toAccountName;

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
              {t.memo || t.categoryName || tt("tx_default_label")}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {t.txType === "TRANSFER"
                ? `${isPositive ? "← " : "→ "}${counterparty ?? "—"}`
                : (t.categoryName ?? "—")}
            </Text>
          </Stack>
        </Group>
        <Stack gap={2} align="flex-end" style={{ flexShrink: 0 }}>
          <Text
            fw={800}
            c={isPositive ? "info.5" : "danger.5"}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {isPositive ? "+" : "-"}
            {fmt(Math.abs(t.signedAmount))}
            {tt("won")}
          </Text>
          <Text
            size="xs"
            c="dimmed"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {tt("balance_current")} {fmt(t.balanceAfter)}
            {tt("won")}
          </Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
}
