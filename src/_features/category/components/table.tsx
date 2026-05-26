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

import IconBox from "_features/common/components/icon-box";

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
  const tKind = useTranslations("enum.category-kind");
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
      <Card radius="lg" p="xs">
        <Stack gap={0}>
          {items.map((it) => (
            <UnstyledButton
              key={it.categoryId}
              onClick={() => onClickRow(it.categoryId)}
              style={{ padding: 12, borderRadius: 12, display: "block" }}
            >
              <Group justify="space-between" gap="md" wrap="nowrap" align="center">
                <Group gap={12} wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                  <IconBox icon={it.icon} color={it.color} />
                  <Text size="sm" fw={600} truncate>
                    {it.name}
                  </Text>
                </Group>
                <Badge
                  size="sm"
                  variant="light"
                  color={it.kind === "INCOME" ? "info" : "danger"}
                  style={{ flexShrink: 0 }}
                >
                  {tKind(it.kind)}
                </Badge>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Card>

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
