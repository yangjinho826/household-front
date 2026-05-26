"use client";

import {
  ActionIcon,
  Card,
  Group,
  SegmentedControl,
  Stack,
  Title,
} from "@mantine/core";
import { IconCalendar, IconList, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import FilterChip from "_features/common/components/filter-chip";
import MonthPicker from "_features/common/components/month-picker";
import { useEnumOptions } from "_features/enum/queries/use-query";
import TransactionCalendarView from "_features/transaction/components/calendar-view";
import TransactionListView from "_features/transaction/components/list-view";
import { useTransactionSearch } from "_features/transaction/hooks/use-sub/use-search";
import { useQuickAddStore } from "_features/transaction/store";
import type { TxType } from "_features/transaction/types";

export default function TransactionsSection() {
  const t = useTranslations("transaction");
  const tTxType = useTranslations("enum.tx-type");
  const openQuickAdd = useQuickAddStore((s) => s.open);

  const {
    view,
    filter,
    month,
    year,
    monthNum,
    setView,
    setFilter,
    setMonth,
  } = useTransactionSearch();

  const { data: txTypeData } = useEnumOptions("tx-type");
  const txTypes = txTypeData.body.data as TxType[];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>{t("list_title")}</Title>
        <ActionIcon
          size="lg"
          radius="xl"
          onClick={openQuickAdd}
          aria-label={t("add")}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>

      <Card radius="lg" p="sm">
        <MonthPicker value={month} onChange={setMonth} />
      </Card>

      <SegmentedControl
        value={view}
        onChange={(v) => setView(v as "list" | "calendar")}
        data={[
          {
            value: "list",
            label: (
              <Group gap={6} justify="center">
                <IconList size={14} />
                <span>{t("view_list")}</span>
              </Group>
            ),
          },
          {
            value: "calendar",
            label: (
              <Group gap={6} justify="center">
                <IconCalendar size={14} />
                <span>{t("view_calendar")}</span>
              </Group>
            ),
          },
        ]}
        fullWidth
      />

      {view === "list" && (
        <Group gap="xs">
          <FilterChip
            label={t("filter_all")}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {txTypes.map((tp) => (
            <FilterChip
              key={tp}
              label={tTxType(tp)}
              active={filter === tp}
              onClick={() => setFilter(tp)}
            />
          ))}
        </Group>
      )}

      {view === "list" ? (
        <TransactionListView
          searchParams={{
            year,
            month: monthNum,
            ...(filter !== "all" && { txType: filter }),
          }}
        />
      ) : (
        <TransactionCalendarView
          key={month}
          year={year}
          month={monthNum}
        />
      )}
    </Stack>
  );
}
