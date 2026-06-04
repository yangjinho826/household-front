"use client";

import { Card, Center, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { InfiniteSentinel } from "_libraries/query/infinite-sentinel";

import type { TransactionFilterMode } from "../hooks/use-sub/use-search";
import { useAccountLedgerInfinite } from "../queries/use-query";
import type { AccountLedgerItemType } from "../types";
import LedgerRow from "./ledger-row";

interface AccountLedgerViewProps {
  accountId: string;
  /** 거래 탭처럼 월별로 볼 때 — 그 달 거래만 + 그달말 기준 잔액 */
  year?: number;
  month?: number;
  /** txType 필터 — 잔액은 백엔드가 박아주므로 클라이언트에서 걸러도 행별 잔액은 정확 */
  filter?: TransactionFilterMode;
  /** running balance 표시 여부 — INVESTMENT 는 매매현금이 빠져 부정확이라 숨긴다 */
  showBalance?: boolean;
}

/**
 * 계좌별 거래 이력 — 일별 그룹 + 무한 스크롤. 각 행에 running balance.
 * year/month 가 있으면 그 달 단위(거래 탭), 없으면 전체(계좌 상세).
 */
export default function AccountLedgerView({
  accountId,
  year,
  month,
  filter = "all",
  showBalance = true,
}: AccountLedgerViewProps) {
  const tg = useTranslations("general.common");
  const tGeneral = useTranslations("general");
  const tTx = useTranslations("transaction");

  const DOW_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  const formatDate = (yyyymmdd: string): string => {
    const [y, m, d] = yyyymmdd.split("-").map(Number) as [number, number, number];
    const dayKey = DOW_KEYS[new Date(y, m - 1, d).getDay()] ?? "sun";
    return tTx("date_with_weekday", {
      month: m,
      day: d,
      weekday: tGeneral(`weekday.${dayKey}`),
    });
  };

  // 월 단위면 그 달 거래가 적어 한 번에(큰 limit), 전체면 무한 스크롤 30
  const isMonthly = year !== undefined && month !== undefined;
  const pageSize = isMonthly ? 500 : 30;

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useAccountLedgerInfinite(accountId, pageSize, year, month);

  const items: AccountLedgerItemType[] = useMemo(() => {
    const all = (data?.pages ?? []).flatMap((p) => p.body.data.items);
    return filter === "all" ? all : all.filter((it) => it.txType === filter);
  }, [data, filter]);

  // 일별 그룹화 — txDate "YYYY-MM-DD"
  const grouped = useMemo(() => {
    const map = new Map<string, AccountLedgerItemType[]>();
    for (const it of items) {
      const key = it.txDate.slice(0, 10);
      const arr = map.get(key) ?? [];
      arr.push(it);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [items]);

  // 빈 결과여도 early return 하지 않는다 — 클라 필터(txType)로 현재 페이지에
  // 해당 거래가 없을 뿐 다음 페이지엔 있을 수 있으므로 sentinel 을 살려 둔다.
  return (
    <Stack gap="md">
      {items.length === 0 ? (
        <Center py="lg">
          <Text c="dimmed" size="sm">
            {tg("no_data")}
          </Text>
        </Center>
      ) : (
        grouped.map(([date, txns]) => (
          <Stack key={date} gap="xs">
            <Text size="sm" fw={700} c="dimmed" px={4}>
              {formatDate(date)}
            </Text>
            <Card p="xs">
              <Stack gap={0}>
                {txns.map((tx) => (
                  <LedgerRow
                    key={tx.transactionId}
                    t={tx}
                    accountId={accountId}
                    showBalance={showBalance}
                  />
                ))}
              </Stack>
            </Card>
          </Stack>
        ))
      )}

      <InfiniteSentinel
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </Stack>
  );
}
