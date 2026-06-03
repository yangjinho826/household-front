"use client";

import { Card, Center, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useTranslations } from "next-intl";

import IconBox from "_features/common/components/icon-box";
import { useMoney } from "_features/common/hooks/use-money";

import { ACCOUNT_TYPE_HEX } from "../constants";
import type { AccountListItemType } from "../types";

interface AccountTableProps {
  items: AccountListItemType[];
  onClickRow: (accountId: string) => void;
}

export default function AccountTable({ items, onClickRow }: AccountTableProps) {
  const tType = useTranslations("enum.account-type");
  const tg = useTranslations("general.common");
  const money = useMoney();

  if (!items.length) {
    return (
      <Center py="md">
        <Text c="dimmed" size="sm">
          {tg("no_data")}
        </Text>
      </Center>
    );
  }

  return (
    <Card radius="lg" p="xs">
      <Stack gap={0}>
        {items.map((it) => {
          const accent = it.color ?? ACCOUNT_TYPE_HEX[it.accountType];
          const isNegative = it.balance < 0;
          return (
            <UnstyledButton
              key={it.accountId}
              onClick={() => onClickRow(it.accountId)}
              style={{ padding: 12, borderRadius: 12, display: "block" }}
            >
              <Group
                justify="space-between"
                gap="md"
                wrap="nowrap"
                align="center"
              >
                <Group gap={12} wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                  <IconBox icon={it.icon} color={accent} />
                  <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                    <Text size="sm" fw={600} truncate>
                      {it.name}
                    </Text>
                    <Text size="xs" c="dimmed" truncate>
                      {tType(it.accountType)}
                    </Text>
                  </Stack>
                </Group>
                <Text
                  fw={800}
                  c={isNegative ? "danger.5" : undefined}
                  style={{
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                  }}
                >
                  {money(it.balance)}
                </Text>
              </Group>
            </UnstyledButton>
          );
        })}
      </Stack>
    </Card>
  );
}
