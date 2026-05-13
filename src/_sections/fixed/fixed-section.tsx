"use client";

import { ActionIcon, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { queryKeys } from "_constants/queries";
import MonthPicker, {
  defaultYearMonth,
} from "_features/common/components/month-picker";
import FixedTable from "_features/fixed/components/table";
import { useFixedSearch } from "_features/fixed/hooks/use-sub/use-search";
import { fmt } from "_utilities/fmt";

export default function FixedSection() {
  const t = useTranslations("fixed");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const {
    result,
    params,
    handlePageChange,
  } = useFixedSearch();

  const items = result?.content ?? [];
  const totalPages = result?.totalPages ?? 1;

  // 선택 월 — 기본 이번달 (YYYY-MM)
  const [month, setMonth] = useState<string>(() => defaultYearMonth());

  // 선택 월의 고정지출별 누적 사용액
  const { data: summary } = useQuery(queryKeys.fixed.monthlySummary(month));
  const usagesByFixed = summary?.body.data.usages;

  // 선택 월 고정지출 총합 — 삭제(soft)된 항목도 sum_by_fixed_for_month 가 포함하므로 정확
  const totalFixedAmount = usagesByFixed
    ? Object.values(usagesByFixed).reduce((sum, v) => sum + v, 0)
    : 0;

  const monthLabel = Number(month.split("-")[1]);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>{t("list_title")}</Title>
        <ActionIcon
          size="lg"
          radius="xl"
          onClick={() => router.push(`/${routeParams.locale}/fixed/new`)}
          aria-label={t("add")}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>

      <Card radius="lg" p="sm">
        <MonthPicker value={month} onChange={setMonth} />
      </Card>

      <Card radius="lg" p="md">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={600} c="dimmed">
            {monthLabel}월 고정지출
          </Text>
          <Text
            size="lg"
            fw={800}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(totalFixedAmount)}원
          </Text>
        </Group>
      </Card>

      <FixedTable
        items={items}
        totalPages={totalPages}
        pageNo={params.pageNo}
        listSize={params.listSize}
        usagesByFixed={usagesByFixed}
        onClickRow={(id) =>
          router.push(`/${routeParams.locale}/fixed/${id}`)
        }
        onPageChange={handlePageChange}
      />
    </Stack>
  );
}
