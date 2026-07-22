"use client";

import { Card, Divider, Group, Progress, SimpleGrid, Stack, Text } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { TOKEN } from "_styles/design-tokens";
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

const TOP_CATEGORY_COUNT = 5;

interface MonthSummaryProps {
  year: number;
  month: number;
}

/**
 * 이번 달 요약 — 수입/지출/저축률 + 지출 카테고리 Top5 가로 바.
 *
 * 리스트/캘린더 뷰 공통 상단(IA 통일). stats/monthly 의 byCategory(ratio)를 재사용.
 */
export default function MonthSummary({ year, month }: MonthSummaryProps) {
  const t = useTranslations("transaction");

  const { data } = useSuspenseQuery(queryKeys.stats.monthly({ year, month }));
  const stats = data.body.data;

  const income = stats.monthlyIncome;
  const expense = stats.monthlyExpense;
  const savingRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  // 지출 카테고리만, 금액 큰 순 Top5 (ratio 는 같은 kind 내 max 대비라 바 너비로 직접 사용)
  const topExpenses = stats.byCategory
    .filter((c) => !c.isIncome)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, TOP_CATEGORY_COUNT);

  return (
    <Card>
      <SimpleGrid cols={3} spacing="sm">
        <Stack gap={2}>
          <Text size="xs" c="dimmed" fw={500}>
            {t("summary_income")}
          </Text>
          <Text
            className="stat-amount"
            c="info.5"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(income)}
          </Text>
        </Stack>
        <Stack gap={2}>
          <Text size="xs" c="dimmed" fw={500}>
            {t("summary_expense")}
          </Text>
          <Text
            className="stat-amount"
            c="danger.5"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(expense)}
          </Text>
        </Stack>
        <Stack gap={2}>
          <Text size="xs" c="dimmed" fw={500}>
            {t("summary_saving_rate")}
          </Text>
          <Text
            className="stat-amount"
            c={savingRate > 0 ? "positive.5" : "dimmed"}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {savingRate.toFixed(0)}%
          </Text>
        </Stack>
      </SimpleGrid>

      <Divider my="md" />
      <Text size="xs" fw={700} c="dimmed" mb="sm">
        {t("summary_top_expense")}
      </Text>
      {topExpenses.length > 0 ? (
        <Stack gap={11}>
          {topExpenses.map((cat) => (
            <Stack key={cat.categoryId} gap={5}>
              <Group justify="space-between" gap="xs" wrap="nowrap">
                <Text size="xs" fw={600} truncate>
                  {cat.name}
                </Text>
                <Text
                  size="xs"
                  fw={700}
                  style={{
                    fontVariantNumeric: "tabular-nums",
                    flexShrink: 0,
                  }}
                >
                  {fmt(cat.amount)}
                </Text>
              </Group>
              <Progress
                value={cat.ratio * 100}
                color={cat.color ?? TOKEN.terracotta}
                size="sm"
                radius="xl"
              />
            </Stack>
          ))}
        </Stack>
      ) : (
        <Text
          size="sm"
          c="dimmed"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {t("summary_no_expense")}
        </Text>
      )}
    </Card>
  );
}
