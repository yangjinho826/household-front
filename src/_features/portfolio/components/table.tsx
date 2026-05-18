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

import type { PortfolioListItemType } from "../types";

interface PortfolioTableProps {
  items: PortfolioListItemType[];
  totalPages: number;
  pageNo: number;
  listSize: number;
  onClickRow: (portfolioId: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

export default function PortfolioTable({
  items,
  totalPages,
  pageNo,
  listSize,
  onClickRow,
  onPageChange,
}: PortfolioTableProps) {
  const tg = useTranslations("general.common");
  const tMarket = useTranslations("enum.market");

  if (!items.length) {
    return (
      <Center py="xl">
        <Text c="dimmed">{tg("no_data")}</Text>
      </Center>
    );
  }

  return (
    <Stack gap="sm">
      {items.map((it) => {
        const cost = it.avgPrice * it.quantity;
        const profit = it.currentValue - cost;
        return (
          <UnstyledButton
            key={it.portfolioId}
            onClick={() => onClickRow(it.portfolioId)}
          >
            <Card>
              <Group justify="space-between">
                <Stack gap={2}>
                  <Text fw={600}>{it.name}</Text>
                  <Text size="xs" c="dimmed">
                    {it.code} · {tMarket(it.market)} · {it.quantity}주 @ {fmt(it.avgPrice)}원
                  </Text>
                </Stack>
                <Stack gap={2} align="end">
                  <Text fw={700} style={{ fontVariantNumeric: "tabular-nums" }}>
                    {fmt(it.currentValue)}원
                  </Text>
                  <Text
                    size="xs"
                    c={profit >= 0 ? "tossRed.5" : "tossBlue.5"}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {profit >= 0 ? "+" : ""}
                    {fmt(profit)}원
                  </Text>
                </Stack>
              </Group>
            </Card>
          </UnstyledButton>
        );
      })}
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
