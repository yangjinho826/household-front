"use client";

import {
  Card,
  Center,
  Group,
  Pagination,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useTranslations } from "next-intl";

import { fmt } from "_utilities/fmt";

import type { TransactionListItemType, TxType } from "../types";

const TYPE_COLOR: Record<TxType, string> = {
  EXPENSE: "tossRed.5",
  FIXED_EXPENSE: "tossRed.5",
  INCOME: "tossGreen.5",
  TRANSFER: "tossPurple.5",
};

interface TransactionTableProps {
  items: TransactionListItemType[];
  totalPages: number;
  pageNo: number;
  listSize: number;
  onClickRow: (transactionId: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

export default function TransactionTable({
  items,
  totalPages,
  pageNo,
  listSize,
  onClickRow,
  onPageChange,
}: TransactionTableProps) {
  const tg = useTranslations("general.common");

  if (!items.length) {
    return (
      <Center py="xl">
        <Text c="dimmed">{tg("no_data")}</Text>
      </Center>
    );
  }

  const sign: Record<TxType, string> = {
    EXPENSE: "-",
    FIXED_EXPENSE: "-",
    INCOME: "+",
    TRANSFER: "→",
  };

  return (
    <Stack gap="sm">
      {items.map((it) => (
        <UnstyledButton
          key={it.transactionId}
          onClick={() => onClickRow(it.transactionId)}
        >
          <Card>
            <Group justify="space-between">
              <Stack gap={2}>
                <Text size="sm" fw={600}>
                  {it.memo || it.categoryName || "거래"}
                </Text>
                <Text size="xs" c="dimmed">
                  {it.categoryName ?? "—"} · {it.accountName ?? "—"}
                  {it.toAccountName ? ` → ${it.toAccountName}` : ""} ·{" "}
                  {it.txDate}
                </Text>
              </Stack>
              <Text
                fw={700}
                c={TYPE_COLOR[it.txType]}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {sign[it.txType]}
                {fmt(it.amount)}원
              </Text>
            </Group>
          </Card>
        </UnstyledButton>
      ))}
      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={pageNo}
            total={totalPages}
            onChange={(p) => onPageChange(p, listSize)}
          />
        </Group>
      )}
    </Stack>
  );
}
