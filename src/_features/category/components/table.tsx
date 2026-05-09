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

import type { CategoryListItemType } from "../types";

interface CategoryTableProps {
  items: CategoryListItemType[];
  totalPages: number;
  pageNo: number;
  listSize: number;
  onClickRow: (categoryId: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

export default function CategoryTable({
  items,
  totalPages,
  pageNo,
  listSize,
  onClickRow,
  onPageChange,
}: CategoryTableProps) {
  const t = useTranslations("category");
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
          key={it.categoryId}
          onClick={() => onClickRow(it.categoryId)}
        >
          <Card>
            <Group justify="space-between">
              <Group gap="xs">
                {it.color && (
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      background: it.color,
                    }}
                  />
                )}
                <Text fw={600}>{it.name}</Text>
                <Badge
                  size="xs"
                  variant="light"
                  color={it.kind === "income" ? "tossGreen" : "tossRed"}
                >
                  {t(`kind_${it.kind}`)}
                </Badge>
              </Group>
              {it.icon && (
                <Text size="xs" c="dimmed">
                  {it.icon}
                </Text>
              )}
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
