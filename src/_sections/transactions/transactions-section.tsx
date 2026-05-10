"use client";

import {
  ActionIcon,
  Group,
  SegmentedControl,
  Stack,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconCalendar, IconList, IconPlus } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import TransactionCalendarView from "_features/transaction/components/calendar-view";
import TransactionListView from "_features/transaction/components/list-view";
import type { TxType } from "_features/transaction/types";

type ViewMode = "list" | "calendar";
type FilterMode = "all" | TxType;

export default function TransactionsSection() {
  const t = useTranslations("transaction");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const [view, setView] = useState<ViewMode>("list");
  const [filter, setFilter] = useState<FilterMode>("all");

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
          <FilterChip
            label={t("tx_type_expense")}
            active={filter === "EXPENSE"}
            onClick={() => setFilter("EXPENSE")}
          />
          <FilterChip
            label={t("tx_type_income")}
            active={filter === "INCOME"}
            onClick={() => setFilter("INCOME")}
          />
          <FilterChip
            label={t("tx_type_transfer")}
            active={filter === "TRANSFER"}
            onClick={() => setFilter("TRANSFER")}
          />
        </Group>
      )}

      {view === "list" ? (
        <TransactionListView
          searchParams={filter === "all" ? {} : { txType: filter }}
        />
      ) : (
        <TransactionCalendarView />
      )}
    </Stack>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        background: active
          ? "var(--mantine-color-tossBlue-0)"
          : "var(--mantine-color-gray-0)",
        color: active
          ? "var(--mantine-color-tossBlue-5)"
          : "var(--mantine-color-gray-7)",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
    </UnstyledButton>
  );
}
