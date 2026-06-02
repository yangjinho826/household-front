"use client";

import { Card, Group, SegmentedControl, Select, Stack } from "@mantine/core";
import { IconBuildingBank, IconCalendar, IconList } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import FilterChip from "_features/common/components/filter-chip";
import { useEnumOptions } from "_features/enum/queries/use-query";
import type {
  TransactionFilterMode,
  TransactionViewMode,
} from "_features/transaction/hooks/use-sub/use-search";
import type { TxType } from "_features/transaction/types";
import { queryKeys } from "_constants/queries";

interface TransactionToolbarProps {
  view: TransactionViewMode;
  filter: TransactionFilterMode;
  accountId: string | undefined;
  onViewChange: (next: TransactionViewMode) => void;
  onFilterChange: (next: TransactionFilterMode) => void;
  onAccountChange: (next: string | undefined) => void;
}

/**
 * 거래 툴바 — 뷰 전환(리스트/캘린더) + 타입 필터칩 + 계좌 필터를 한 덩어리로.
 *
 * 세그먼트가 요약 카드 아래 동동 떠보이던 문제 해소(codex 리뷰). 타입/계좌 필터는
 * 리스트 뷰에서만 노출 — 캘린더는 calendarFull API 가 일별 합계까지 묶여 계좌 필터 미지원.
 */
export default function TransactionToolbar({
  view,
  filter,
  accountId,
  onViewChange,
  onFilterChange,
  onAccountChange,
}: TransactionToolbarProps) {
  const t = useTranslations("transaction");
  const tTxType = useTranslations("enum.tx-type");

  const { data: txTypeData } = useEnumOptions("tx-type");
  const txTypes = txTypeData.body.data as TxType[];

  const { data: formOptions } = useSuspenseQuery(
    queryKeys.transaction.formOptions(),
  );
  const accounts = formOptions.body.data.accounts;

  return (
    <Card p="sm">
      <Stack gap="sm">
        <SegmentedControl
          value={view}
          onChange={(v) => onViewChange(v as TransactionViewMode)}
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
          <Group justify="space-between" align="center" gap="xs" wrap="wrap">
            <Group gap="xs">
              <FilterChip
                label={t("filter_all")}
                active={filter === "all"}
                onClick={() => onFilterChange("all")}
              />
              {txTypes.map((tp) => (
                <FilterChip
                  key={tp}
                  label={tTxType(tp)}
                  active={filter === tp}
                  onClick={() => onFilterChange(tp)}
                />
              ))}
            </Group>

            <Select
              value={accountId ?? null}
              onChange={(v) => onAccountChange(v ?? undefined)}
              data={accounts.map((a) => ({
                value: a.accountId,
                label: a.name,
              }))}
              placeholder={t("filter_all_accounts")}
              clearable
              leftSection={<IconBuildingBank size={15} />}
              size="xs"
              radius="md"
              w={160}
              comboboxProps={{ withinPortal: true }}
            />
          </Group>
        )}
      </Stack>
    </Card>
  );
}
