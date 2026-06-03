"use client";

import { ActionIcon, Card, Center, Loader, Stack, Text } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { Suspense } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { useTranslations } from "next-intl";

import { LEDGER_ACCOUNT_TYPES } from "_features/account/constants";
import { useAccountReport } from "_features/account/queries/use-query";
import { useAccountSheetStore } from "_features/account/store";
import { useMonthLabel } from "_features/common/hooks/use-month-label";
import { useMoney } from "_features/common/hooks/use-money";
import SubHeader from "_features/layout/components/sub-header";
import AccountLedgerView from "_features/transaction/components/account-ledger-view";
import AccountBalanceTrend from "_sections/wealth/components/account-balance-trend";

interface Props {
  accountId: string;
}

// 막대 위에 호버/탭하면 그달 수입·지출을 같이 보여줌
function FlowTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
  label?: string;
}) {
  const money = useMoney();
  const t = useTranslations("transaction");
  if (!active || !payload?.length) return null;
  const income = payload.find((p) => p.dataKey === "income")?.value ?? 0;
  const expense = payload.find((p) => p.dataKey === "expense")?.value ?? 0;
  return (
    <div
      style={{
        background: "var(--mantine-color-body)",
        border: "1px solid var(--mantine-color-gray-2)",
        borderRadius: 10,
        padding: "8px 12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Text size="xs" c="dimmed" fw={600}>
        {label}
      </Text>
      <Text
        size="xs"
        fw={700}
        c="positive.6"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {t("summary_income")} +{money(income)}
      </Text>
      <Text
        size="xs"
        fw={700}
        c="danger.5"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {t("summary_expense")} −{money(expense)}
      </Text>
    </div>
  );
}

export default function AccountReportSection({ accountId }: Props) {
  const openAccountSheet = useAccountSheetStore((s) => s.open);
  const t = useTranslations("transaction");
  const tAccount = useTranslations("account");
  const tGeneral = useTranslations("general.common");
  const monthLabel = useMonthLabel();
  const money = useMoney();
  const { data } = useAccountReport(accountId);
  const report = data.body.data;
  const showLedger = LEDGER_ACCOUNT_TYPES.has(report.accountType);

  // 지출 = 일반지출 + 고정지출 합산 (막대 하나로)
  const chartData = report.monthlyFlows.map((f) => ({
    month: monthLabel(f.monthDate),
    income: f.income,
    expense: f.expense + f.fixedExpense,
  }));
  // 수입·지출이 전부 0 이면 빈 차트 대신 안내 (거래 없는 통장 / 운영 초기)
  const hasFlow = chartData.some((d) => d.income > 0 || d.expense > 0);

  return (
    <Stack gap="md">
      <SubHeader
        title={report.accountName}
        right={
          <ActionIcon
            variant="subtle"
            aria-label={tGeneral("update")}
            onClick={() => openAccountSheet(accountId)}
          >
            <IconPencil size={20} />
          </ActionIcon>
        }
      />

      {/* 현재 잔액 */}
      <Card radius="xl" p="xl" shadow="md">
        <Stack gap={4}>
          <Text size="xs" fw={500} c="dimmed">
            {tAccount("current_balance")}
          </Text>
          <Text
            size="2rem"
            fw={800}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {money(report.balance)}
          </Text>
        </Stack>
      </Card>

      {/* 월별 수입/지출 추이 */}
      <Card radius="lg" p="md">
        <Stack gap="sm">
          <Text size="sm" fw={700}>
            {tAccount("monthly_flow")}
          </Text>
          {chartData.length === 0 || !hasFlow ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              {tAccount("empty_flow")}
            </Text>
          ) : (
            <div className="chart-trend-wrap">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  data={chartData}
                  margin={{ top: 12, right: 0, bottom: 0, left: 0 }}
                  barGap={2}
                >
                  <Bar
                    dataKey="income"
                    fill="var(--mantine-color-positive-6)"
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill="var(--mantine-color-danger-5)"
                    radius={[3, 3, 0, 0]}
                  />
                  <Tooltip
                    content={<FlowTooltip />}
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 9, fill: "#A99C8D" }}
                    axisLine={false}
                    tickLine={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Stack>
      </Card>

      {/* 월별 잔액 추이 — 투자계좌/종목 상세와 동일한 라인차트 */}
      <Suspense
        fallback={
          <Center py="md">
            <Loader size="sm" />
          </Center>
        }
      >
        <AccountBalanceTrend accountId={accountId} title={tAccount("balance_trend")} />
      </Suspense>

      {/* 거래 이력 — 각 행에 running balance. 거래계좌만 노출 */}
      {showLedger && (
        <Stack gap="sm">
          <Text size="sm" fw={700} px={4}>
            {t("ledger_title")}
          </Text>
          <AccountLedgerView accountId={accountId} />
        </Stack>
      )}
    </Stack>
  );
}
