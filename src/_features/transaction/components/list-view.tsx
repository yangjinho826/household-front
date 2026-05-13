"use client";

import { Card, Center, Loader, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";

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
    () => (data?.pages ?? []).flatMap((p) => p.body.data.content),
    [data],
  );

  // 월별 그룹화 — txDate "YYYY-MM-DD" 의 앞 7자리 (YYYY-MM)
  const grouped = useMemo(() => {
    const map = new Map<string, TransactionListItemType[]>();
    for (const it of items) {
      const key = it.txDate.slice(0, 7);
      const arr = map.get(key) ?? [];
      arr.push(it);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [items]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (items.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed">{tg("no_data")}</Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {grouped.map(([month, txns]) => (
        <Stack key={month} gap="xs">
          <Text size="sm" fw={700} c="dimmed" px={4}>
            {formatMonth(month)}
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

      {hasNextPage && (
        <Center ref={loadMoreRef} py="md">
          {isFetchingNextPage && <Loader size="sm" />}
        </Center>
      )}
    </Stack>
  );
}

function formatMonth(yyyymm: string): string {
  const [y, m] = yyyymm.split("-");
  return `${y}년 ${Number(m)}월`;
}
