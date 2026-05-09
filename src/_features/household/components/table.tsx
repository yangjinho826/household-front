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

import type { HouseholdListItemType } from "../types";

interface HouseholdTableProps {
  items: HouseholdListItemType[];
  totalPages: number;
  pageNo: number;
  listSize: number;
  onClickRow: (householdId: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

export default function HouseholdTable({
  items,
  totalPages,
  pageNo,
  listSize,
  onClickRow,
  onPageChange,
}: HouseholdTableProps) {
  const t = useTranslations("household");
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
          key={it.householdId}
          onClick={() => onClickRow(it.householdId)}
        >
          <Card>
            <Group justify="space-between">
              <Stack gap={2}>
                <Text fw={700}>{it.name}</Text>
                {it.description && (
                  <Text size="xs" c="dimmed">
                    {it.description}
                  </Text>
                )}
              </Stack>
              <Text size="xs" c="dimmed">
                {t("member_count", { count: it.memberCount ?? 0 })}
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
