"use client";

import {
  ActionIcon,
  Card,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEye, IconEyeOff, IconRefresh } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { useAccountSnapshotMutations } from "_features/account-snapshot/queries/use-mutations";
import { queryKeys } from "_constants/queries";
import { getErrorMessage } from "_libraries/fetch/error-message";
import { fmt } from "_utilities/fmt";

import SnapshotDrilldownPanel from "_sections/wealth/components/snapshot-drilldown-panel";

interface TrendPoint {
  month: string;
  value: number;
  momPct: number | null; // 전월 대비 증감률
}

// 추이 차트 점을 탭하면 그달 총자산 + 전월대비 증감을 보여줌
function TrendTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: TrendPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  if (!p) return null;
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
        {p.month}
      </Text>
      <Text size="sm" fw={800} style={{ fontVariantNumeric: "tabular-nums" }}>
        {fmt(p.value)}원
      </Text>
      {p.momPct !== null && (
        <Text
          size="xs"
          fw={700}
          c={p.momPct >= 0 ? "linerGreen.6" : "danger.5"}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          전월 {p.momPct >= 0 ? "+" : "−"}
          {Math.abs(p.momPct).toFixed(1)}%
        </Text>
      )}
    </div>
  );
}

/**
 * TotalAssetHero — 홈 자산 대시보드 상단 hero.
 *
 * 총자산 + 전월대비 증감 + 월별 추이 AreaChart(탭하면 그달 분해) + 지난달 수동 박제.
 * wealth.overview 를 단독 소비(홈의 다른 쿼리와 캐시 공유).
 */
export default function TotalAssetHero() {
  const te = useTranslations("error");

  const { data: overviewRes } = useSuspenseQuery(queryKeys.wealth.overview({}));
  const { createMutation } = useAccountSnapshotMutations();

  // 추이 차트에서 탭한 월 — 그달 계좌별 분해 패널 표시용
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  // 프라이버시 — 총자산 금액 blur 토글
  const [hidden, setHidden] = useState(true);

  const overview = overviewRes.body.data;
  const yearly = overview.yearlySnapshots;
  const total = overview.totalBalance;

  const selectedMonth =
    selectedIdx !== null ? (yearly.months[selectedIdx] ?? null) : null;

  const trendData = useMemo<TrendPoint[]>(
    () =>
      yearly.months.map((m, i) => {
        const prev = i > 0 ? (yearly.months[i - 1]?.totalBalance ?? null) : null;
        const momPct =
          prev && prev > 0 ? ((m.totalBalance - prev) / prev) * 100 : null;
        return {
          month: `${Number(m.snapshotDate.slice(5, 7))}월`, // "5월"
          value: m.totalBalance,
          momPct,
        };
      }),
    [yearly.months],
  );

  // 추이 기간 전체 증감 — 첫 박제월 대비 현재 총자산
  const periodPct = useMemo(() => {
    const first = yearly.months[0]?.totalBalance;
    if (!first || first <= 0 || yearly.months.length < 2) return null;
    return ((total - first) / first) * 100;
  }, [yearly.months, total]);
  const periodMonths = trendData.length;

  // 전월 대비 증감 — 현재 총자산 vs 가장 최근 박제 스냅샷
  const lastSnapshot =
    yearly.months.length > 0 ? yearly.months[yearly.months.length - 1] : null;
  const diff = lastSnapshot ? total - lastSnapshot.totalBalance : null;
  const diffPct =
    lastSnapshot && lastSnapshot.totalBalance > 0
      ? ((total - lastSnapshot.totalBalance) / lastSnapshot.totalBalance) * 100
      : null;
  const lastSnapshotLabel = lastSnapshot
    ? `${Number(lastSnapshot.snapshotDate.slice(5, 7))}월`
    : "";

  // 수동 박제 — 지난달(targetMonth) upsert. 이미 저장됐어도 다시 눌러 갱신 가능.
  const isTargetSaved = yearly.targetMonthSaved;
  const targetMonthLabel = `${Number(yearly.targetMonthDate.slice(5, 7))}월`;

  const handleTakeSnapshot = () => {
    if (createMutation.isPending) return;
    modals.openConfirmModal({
      centered: true,
      title: `${targetMonthLabel} 자산 기록`,
      labels: {
        confirm: isTargetSaved ? "덮어쓰기" : "기록하기",
        cancel: "취소",
      },
      children: (
        <Text size="sm">
          {isTargetSaved
            ? `이미 저장된 ${targetMonthLabel} 자산을 현재 잔액으로 덮어쓸까요?`
            : `${targetMonthLabel} 자산 스냅샷을 저장할까요?`}
          <br />
          모든 통장의 현재 잔액이 기록됩니다.
        </Text>
      ),
      onConfirm: async () => {
        try {
          await createMutation.mutateAsync();
          notifications.show({
            title: "기록 완료",
            message: `${targetMonthLabel} 자산이 기록되었습니다.`,
            color: "green",
          });
        } catch (error) {
          notifications.show({
            title: "기록 실패",
            message: getErrorMessage(error, te),
            color: "red",
          });
        }
      },
    });
  };

  return (
    <>
      <Card radius="xl" p="xl" shadow="md">
        <Stack gap={4}>
          <Group justify="space-between" align="center">
            <Group gap={4}>
              <Text size="xs" fw={500} c="dimmed">
                총 자산
              </Text>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => setHidden((v) => !v)}
                aria-label={hidden ? "show amount" : "hide amount"}
              >
                {hidden ? <IconEyeOff size={14} /> : <IconEye size={14} />}
              </ActionIcon>
            </Group>
            <UnstyledButton
              onClick={handleTakeSnapshot}
              disabled={createMutation.isPending}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: "var(--mantine-color-info-0)",
                opacity: createMutation.isPending ? 0.5 : 1,
              }}
            >
              <Group gap={4} wrap="nowrap">
                <IconRefresh size={12} stroke={3} color="#3B82F6" />
                <Text size="10px" fw={700} c="info.5">
                  {isTargetSaved
                    ? `${targetMonthLabel} 갱신`
                    : `${targetMonthLabel} 기록`}
                </Text>
              </Group>
            </UnstyledButton>
          </Group>
          <Text
            size="2rem"
            fw={800}
            style={{
              fontVariantNumeric: "tabular-nums",
              filter: hidden ? "blur(10px)" : "none",
              transition: "filter 0.2s ease",
              userSelect: hidden ? "none" : "auto",
              cursor: hidden ? "pointer" : "default",
            }}
            onClick={() => hidden && setHidden(false)}
          >
            {fmt(total)}
            <Text span size="lg" c="dimmed" ml={4} fw={600}>
              원
            </Text>
          </Text>
          {diff !== null && (
            <Text
              size="sm"
              fw={600}
              c={diff >= 0 ? "linerGreen.6" : "danger.5"}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {lastSnapshotLabel} 기록 대비 {diff >= 0 ? "+" : "−"}
              {fmt(Math.abs(diff))}원
              {diffPct !== null &&
                ` (${diff >= 0 ? "+" : "−"}${Math.abs(diffPct).toFixed(1)}%)`}
            </Text>
          )}
          {periodPct !== null && (
            <Group justify="space-between" align="center" mt={8} mb={-4}>
              <Text size="xs" c="dimmed" fw={600}>
                최근 {periodMonths}개월 추이
              </Text>
              <Text
                size="xs"
                fw={700}
                c={periodPct >= 0 ? "linerGreen.6" : "danger.5"}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {periodPct >= 0 ? "+" : "−"}
                {Math.abs(periodPct).toFixed(1)}%
              </Text>
            </Group>
          )}
          <div className="chart-trend-wrap">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart
                data={trendData}
                margin={{ top: 12, right: 0, bottom: 0, left: 0 }}
                onClick={(state) => {
                  // recharts v3: 클릭 위치는 activeIndex(문자열일 수 있음) / activeLabel 로 옴
                  let idx: number | null = null;
                  const ai = state?.activeIndex;
                  if (ai != null && ai !== "") {
                    const n = Number(ai);
                    if (!Number.isNaN(n)) idx = n;
                  }
                  if (idx === null && state?.activeLabel) {
                    const found = trendData.findIndex(
                      (d) => d.month === state.activeLabel,
                    );
                    if (found >= 0) idx = found;
                  }
                  if (idx !== null) {
                    const target = idx;
                    setSelectedIdx((cur) => (cur === target ? null : target));
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <defs>
                  <linearGradient id="wealthTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#wealthTrend)"
                  dot={{ r: 2.5, fill: "#3B82F6", strokeWidth: 0 }}
                  activeDot={{
                    r: 5,
                    fill: "#3B82F6",
                    stroke: "var(--mantine-color-body)",
                    strokeWidth: 2,
                  }}
                />
                <Tooltip
                  content={<TrendTooltip />}
                  cursor={{
                    stroke: "#3B82F6",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 9, fill: "#8B95A1" }}
                  axisLine={false}
                  tickLine={false}
                  interval={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Stack>
      </Card>

      {selectedMonth && (
        <SnapshotDrilldownPanel
          month={selectedMonth}
          onClose={() => setSelectedIdx(null)}
        />
      )}
    </>
  );
}
