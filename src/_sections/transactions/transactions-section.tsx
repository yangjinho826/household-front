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
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import FilterChip from "_features/common/components/filter-chip";
import MonthPicker, {
  defaultYearMonth,
} from "_features/common/components/month-picker";
import { useEnumOptions } from "_features/enum/queries/use-query";
import TransactionCalendarView from "_features/transaction/components/calendar-view";
import TransactionListView from "_features/transaction/components/list-view";
import type { TxType } from "_features/transaction/types";

type ViewMode = "list" | "calendar";
type FilterMode = "all" | TxType;

export default function TransactionsSection() {
  const t = useTranslations("transaction");
  const tTxType = useTranslations("enum.tx-type");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const [view, setView] = useState<ViewMode>("list");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [month, setMonth] = useState<string>(() => defaultYearMonth());

  const { data: txTypeData } = useEnumOptions("tx-type");
  const txTypes = txTypeData.body.data as TxType[];

  const [yearStr, monthStr] = month.split("-");
  const yearNum = Number(yearStr);
  const monthNum = Number(monthStr);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>{t("list_title")}</Title>
        <ActionIcon
          size="lg"
          radius="xl"
          onClick={() =>
            router.push(`/${routeParams.locale}/transactions/new`)
          }
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
        onChange={(v) => setView(v as ViewMode)}
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
            year: yearNum,
            month: monthNum,
            ...(filter !== "all" && { txType: filter }),
          }}
        />
      ) : (
        <TransactionCalendarView
          key={month}
          year={yearNum}
          month={monthNum}
        />
      )}
    </Stack>
  );
}
