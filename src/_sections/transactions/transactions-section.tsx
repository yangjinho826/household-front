"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import MonthPicker from "_features/common/components/month-picker";
import AccountLedgerView from "_features/transaction/components/account-ledger-view";
import TransactionCalendarView from "_features/transaction/components/calendar-view";
import { useTransactionSearch } from "_features/transaction/hooks/use-sub/use-search";
import { useQuickAddStore } from "_features/transaction/store";
import { queryKeys } from "_constants/queries";

import MonthSummary from "./components/month-summary";
import TransactionToolbar from "./components/transaction-toolbar";

export default function TransactionsSection() {
  const t = useTranslations("transaction");
  const openQuickAdd = useQuickAddStore((s) => s.open);

  const {
    view,
    filter,
    month,
    year,
    monthNum,
    accountId,
    setView,
    setFilter,
    setMonth,
    setAccountId,
  } = useTransactionSearch();

  // INVESTMENT 통장은 매매현금이 ledger 밖이라 running balance 부정확 → 잔액 숨김.
  const { data: formOptions } = useSuspenseQuery(
    queryKeys.transaction.formOptions(),
  );
  const selectedAccount = formOptions.body.data.accounts.find(
    (a) => a.accountId === accountId,
  );
  const showBalance = selectedAccount?.accountType !== "INVESTMENT";

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Title order={3}>{t("list_title")}</Title>
        <Group gap="xs" wrap="nowrap">
          <MonthPicker value={month} onChange={setMonth} />
          <ActionIcon
            size="lg"
            radius="xl"
            onClick={() => openQuickAdd()}
            aria-label={t("add")}
          >
            <IconPlus size={18} />
          </ActionIcon>
        </Group>
      </Group>

      {/* 이번 달 요약 — 리스트/캘린더 공통 상단 */}
      <MonthSummary year={year} month={monthNum} />

      {/* 거래 툴바 — 뷰 전환 + 필터 한 덩어리 */}
      <TransactionToolbar
        view={view}
        filter={filter}
        accountId={accountId}
        onViewChange={setView}
        onFilterChange={setFilter}
        onAccountChange={setAccountId}
      />

      {view === "list" ? (
        accountId ? (
          <AccountLedgerView
            accountId={accountId}
            year={year}
            month={monthNum}
            filter={filter}
            showBalance={showBalance}
          />
        ) : null // 첫 거래계좌 자동 선택 직전 — toolbar useEffect 가 즉시 채움
      ) : (
        <TransactionCalendarView key={month} year={year} month={monthNum} />
      )}
    </Stack>
  );
}
