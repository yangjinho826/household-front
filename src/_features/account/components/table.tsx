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

import IconBox from "_features/common/components/icon-box";
import { fmt } from "_utilities/fmt";

import { ACCOUNT_TYPE_HEX } from "../constants";
import type { AccountListItemType } from "../types";

interface AccountTableProps {
  items: AccountListItemType[];
  totalPages: number;
  pageNo: number;
  listSize: number;
  onClickRow: (accountId: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  /** 페이지네이션 노출 여부 (그룹 안에서 쓸 땐 숨김) */
  showPagination?: boolean;
}

export default function AccountTable({
  items,
  totalPages,
  pageNo,
  listSize,
  onClickRow,
  onPageChange,
  showPagination = true,
}: AccountTableProps) {
  const tType = useTranslations("enum.account-type");
  const tg = useTranslations("general.common");

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
    <Stack gap="sm">
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
                <Group justify="space-between" gap="md" wrap="nowrap" align="center">
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
                    c={isNegative ? "tossRed.5" : undefined}
                    style={{
                      fontVariantNumeric: "tabular-nums",
                      flexShrink: 0,
                    }}
                  >
                    {fmt(it.balance)}원
                  </Text>
                </Group>
              </UnstyledButton>
            );
          })}
        </Stack>
      </Card>

      {showPagination && totalPages > 1 && (
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
