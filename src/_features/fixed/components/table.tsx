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

import type { FixedListItemType } from "../types";

interface FixedTableProps {
  items: FixedListItemType[];
  totalPages: number;
  pageNo: number;
  listSize: number;
  onClickRow: (fixedId: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

export default function FixedTable({
  items,
  totalPages,
  pageNo,
  listSize,
  onClickRow,
  onPageChange,
}: FixedTableProps) {
  const t = useTranslations("fixed");
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
          key={it.fixedId}
          onClick={() => onClickRow(it.fixedId)}
        >
          <Card>
            <Group justify="space-between">
              <Stack gap={2}>
                <Group gap="xs">
                  {it.color && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        background: it.color,
                      }}
                    />
                  )}
                  <Text fw={600}>{it.name}</Text>
                </Group>
                <Text size="xs" c="dimmed">
                  {t("day_format", { day: it.dayOfMonth })}
                </Text>
              </Stack>
              <Text fw={700} style={{ fontVariantNumeric: "tabular-nums" }}>
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
