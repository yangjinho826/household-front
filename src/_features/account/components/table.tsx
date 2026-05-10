"use client";

import {
  Badge,
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

import type { AccountListItemType, AccountType } from "../types";

const TYPE_COLOR: Record<AccountType, string> = {
  LIVING: "tossBlue",
  SAVINGS: "tossGreen",
  INVESTMENT: "tossPurple",
};

interface AccountTableProps {
  items: AccountListItemType[];
  totalPages: number;
  pageNo: number;
  listSize: number;
  onClickRow: (accountId: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

export default function AccountTable({
  items,
  totalPages,
  pageNo,
  listSize,
  onClickRow,
  onPageChange,
}: AccountTableProps) {
  const t = useTranslations("account");
  const tg = useTranslations("general.common");

  if (!items.length) {
    return (
      <Center py="xl">
        <Text c="dimmed">{tg("no_data")}</Text>
      </Center>
    );
  }

  return (
    <Stack gap="sm">
      {items.map((it) => (
        <UnstyledButton
          key={it.accountId}
          onClick={() => onClickRow(it.accountId)}
        >
          <Card>
            <Group justify="space-between">
              <Stack gap={2}>
                <Group gap="xs">
                  <Text fw={700}>{it.name}</Text>
                  <Badge
                    size="xs"
                    variant="light"
                    color={TYPE_COLOR[it.accountType] ?? "gray"}
                  >
                    {t(`type_${it.accountType}`)}
                  </Badge>
                </Group>
                {it.icon && (
                  <Text size="xs" c="dimmed">
                    {it.icon}
                  </Text>
                )}
              </Stack>
              <Text
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
                c={it.startBalance < 0 ? "tossRed.5" : undefined}
              >
                {fmt(it.startBalance)}원
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
