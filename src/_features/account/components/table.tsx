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

import type { AccountListItemType } from "../types";

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
            <Stack gap={2}>
              <Text fw={700}>{it.name}</Text>
              {it.icon && (
                <Text size="xs" c="dimmed">
                  {it.icon}
                </Text>
              )}
            </Stack>
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
