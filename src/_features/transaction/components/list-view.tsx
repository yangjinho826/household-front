"use client";

import { Card, Center, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { InfiniteSentinel } from "_libraries/query/infinite-sentinel";

import { useTransactionInfiniteList } from "../queries/use-query";
import type {
  TransactionListItemType,
  TransactionSearchRequestType,
} from "../types";
import TxRow from "./tx-row";

interface ListViewProps {
  searchParams: TransactionSearchRequestType;
}

/**
 * 월별 그룹화 + 무한 스크롤 거래 리스트.
 *
 * sentinel 이 뷰포트에 들어오면 다음 페이지 자동 fetch.
 */
export default function TransactionListView({ searchParams }: ListViewProps) {
  const tg = useTranslations("general.common");

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useTransactionInfiniteList(searchParams, 30);

  const items: TransactionListItemType[] = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.body.data.items),
    [data],
  );

  // 일별 그룹화 — txDate "YYYY-MM-DD" 전체
  const grouped = useMemo(() => {
    const map = new Map<string, TransactionListItemType[]>();
    for (const it of items) {
      const key = it.txDate.slice(0, 10);
      const arr = map.get(key) ?? [];
      arr.push(it);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [items]);

  if (items.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed">{tg("no_data")}</Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {grouped.map(([date, txns]) => (
        <Stack key={date} gap="xs">
          <Text size="sm" fw={700} c="dimmed" px={4}>
            {formatDate(date)}
          </Text>
          <Card radius="lg" p="xs">
            <Stack gap={0}>
              {txns.map((tx) => (
                <TxRow key={tx.transactionId} t={tx} />
              ))}
            </Stack>
          </Card>
        </Stack>
      ))}

      <InfiniteSentinel
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </Stack>
  );
}

const DOW = ["일", "월", "화", "수", "목", "금", "토"] as const;

function formatDate(yyyymmdd: string): string {
  const [y, m, d] = yyyymmdd.split("-").map(Number) as [number, number, number];
  const dow = DOW[new Date(y, m - 1, d).getDay()] ?? "";
  return `${m}월 ${d}일 (${dow})`;
}
