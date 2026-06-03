"use client";

import { Card, Center, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useTranslations } from "next-intl";

import IconBox from "_features/common/components/icon-box";
import { useMoney } from "_features/common/hooks/use-money";

import type { FixedListItemType } from "../types";

interface FixedTableProps {
  items: FixedListItemType[];
  /** fixedId → 선택 월 누적 사용액 (없으면 0) */
  usagesByFixed?: Record<string, number>;
  onClickRow: (fixedId: string) => void;
}

export default function FixedTable({
  items,
  usagesByFixed,
  onClickRow,
}: FixedTableProps) {
  const t = useTranslations("fixed");
  const tg = useTranslations("general.common");
  const money = useMoney();

  if (!items.length) {
    return (
      <Center py="xl">
        <Text c="dimmed">{tg("no_data")}</Text>
      </Center>
    );
  }

  return (
    <Card radius="lg" p="xs">
      <Stack gap={0}>
        {items.map((it) => {
          const used = usagesByFixed?.[it.fixedId] ?? 0;
          const accent = it.color ?? it.categoryColor;
          const iconName = it.icon ?? it.categoryIcon;
          return (
            <UnstyledButton
              key={it.fixedId}
              onClick={() => onClickRow(it.fixedId)}
              style={{ padding: 12, borderRadius: 12, display: "block" }}
            >
              <Group
                justify="space-between"
                gap="md"
                wrap="nowrap"
                align="center"
              >
                <Group gap={12} wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                  <IconBox icon={iconName} color={accent} />
                  <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                    <Text size="sm" fw={600} truncate>
                      {it.name}
                    </Text>
                    <Text size="xs" c="dimmed" truncate>
                      {t("day_format", { day: it.dayOfMonth })}
                      {it.categoryName ? ` · ${it.categoryName}` : ""}
                    </Text>
                  </Stack>
                </Group>
                <Text
                  fw={800}
                  c={used > 0 ? undefined : "dimmed"}
                  style={{
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                  }}
                >
                  {money(used)}
                </Text>
              </Group>
            </UnstyledButton>
          );
        })}
      </Stack>
    </Card>
  );
}
