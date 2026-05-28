"use client";

import { Card, Center, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useTranslations } from "next-intl";

import type { HouseholdListItemType } from "../types";

interface HouseholdTableProps {
  items: HouseholdListItemType[];
  onClickRow: (householdId: string) => void;
}

// 한 user 의 가입 가계부 수가 작아 페이징 X. 클릭 가능한 카드 리스트만.
export default function HouseholdTable({ items, onClickRow }: HouseholdTableProps) {
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
    </Stack>
  );
}
