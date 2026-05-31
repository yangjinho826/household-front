"use client";

import { ActionIcon, Card, Group, Stack, Text } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { useAccountReport } from "_features/account/queries/use-query";
import SubHeader from "_features/layout/components/sub-header";
import { fmt } from "_utilities/fmt";

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
        c="linerGreen.6"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        수입 +{fmt(income)}원
      </Text>
      <Text
        size="xs"
        fw={700}
        c="danger.5"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        지출 −{fmt(expense)}원
      </Text>
    </div>
  );
}

export default function AccountReportSection({ accountId }: Props) {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const { data } = useAccountReport(accountId);
  const report = data.body.data;

  // 지출 = 일반지출 + 고정지출 합산 (막대 하나로)
  const chartData = report.monthlyFlows.map((f) => ({
    month: `${Number(f.monthDate.slice(5, 7))}월`,
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
            aria-label="수정"
            onClick={() =>
              router.push(`/${locale}/account/${accountId}/edit`)
            }
          >
            <IconPencil size={20} />
          </ActionIcon>
        }
      />

      {/* 현재 잔액 */}
      <Card radius="xl" p="xl" shadow="md">
        <Stack gap={4}>
          <Text size="xs" fw={500} c="dimmed">
            현재 잔액
          </Text>
          <Text
            size="2rem"
            fw={800}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(report.balance)}
            <Text span size="lg" c="dimmed" ml={4} fw={600}>
              원
            </Text>
          </Text>
        </Stack>
      </Card>

      {/* 월별 수입/지출 추이 */}
      <Card radius="lg" p="md">
        <Stack gap="sm">
          <Text size="sm" fw={700}>
            월별 수입 · 지출
          </Text>
          {chartData.length === 0 || !hasFlow ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              표시할 수입·지출 내역이 없어요
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
                    fill="var(--mantine-color-linerGreen-6)"
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
                    tick={{ fontSize: 9, fill: "#8B95A1" }}
                    axisLine={false}
                    tickLine={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Stack>
      </Card>

      {/* 월별 상세 (최근 달부터) */}
      {report.monthlyFlows.length > 0 && (
        <Card radius="lg" p="md">
          <Stack gap="sm">
            <Text size="sm" fw={700}>
              월별 내역
            </Text>
            {[...report.monthlyFlows].reverse().map((f) => (
              <Group
                key={f.monthDate}
                justify="space-between"
                wrap="nowrap"
                align="flex-start"
              >
                <Text size="sm" fw={600}>
                  {f.monthDate.slice(0, 7)}
                </Text>
                <Stack gap={2} align="flex-end">
                  <Text
                    size="sm"
                    fw={700}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {fmt(f.balance)}원
                  </Text>
                  <Group gap={8}>
                    <Text
                      size="xs"
                      fw={600}
                      c="linerGreen.6"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      +{fmt(f.income)}
                    </Text>
                    <Text
                      size="xs"
                      fw={600}
                      c="danger.5"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      −{fmt(f.expense + f.fixedExpense)}
                    </Text>
                  </Group>
                </Stack>
              </Group>
            ))}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
