"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import MonthPicker from "_features/common/components/month-picker";
import TransactionCalendarView from "_features/transaction/components/calendar-view";
import TransactionListView from "_features/transaction/components/list-view";
import { useTransactionSearch } from "_features/transaction/hooks/use-sub/use-search";
import { useQuickAddStore } from "_features/transaction/store";

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

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Title order={3}>{t("list_title")}</Title>
        <Group gap="xs" wrap="nowrap">
          <MonthPicker value={month} onChange={setMonth} />
          <ActionIcon
            size="lg"
            radius="xl"
            onClick={openQuickAdd}
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
        <TransactionListView
          searchParams={{
            year,
            month: monthNum,
            ...(filter !== "all" && { txType: filter }),
            ...(accountId && { accountId }),
          }}
        />
      ) : (
        <TransactionCalendarView key={month} year={year} month={monthNum} />
      )}
    </Stack>
  );
}
