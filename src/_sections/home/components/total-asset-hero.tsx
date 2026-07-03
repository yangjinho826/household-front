"use client";

import {
  ActionIcon,
  Card,
  Group,
  Modal,
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
  YAxis,
} from "recharts";

import { useAccountSnapshotMutations } from "_features/account-snapshot/queries/use-mutations";
import { useMonthLabel } from "_features/common/hooks/use-month-label";
import { queryKeys } from "_constants/queries";
import { getErrorMessage } from "_libraries/fetch/error-message";
import { trendYDomain } from "_utilities/chart";
import { fmt } from "_utilities/fmt";

import SnapshotDrilldownPanel from "_sections/wealth/components/snapshot-drilldown-panel";

interface TrendPoint {
  month: string;
  value: number;
  momPct: number | null; // 전월 대비 증감률
  isCurrent?: boolean; // 실시간 현재점(박제 아님) — 클릭 드릴다운 제외/마커 구분용
}

// 추이 차트 점을 탭하면 그달 총자산 + 전월대비 증감을 보여줌
function TrendTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: TrendPoint }[];
}) {
  const t = useTranslations("home");
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
        {fmt(p.value)}
        {t("won")}
      </Text>
      {p.momPct !== null && (
        <Text
          size="xs"
          fw={700}
          c={p.momPct >= 0 ? "positive.6" : "danger.5"}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {t("trend_prev")} {p.momPct >= 0 ? "+" : "−"}
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
  const t = useTranslations("home");
  const tCommon = useTranslations("general.common");
  const te = useTranslations("error");
  const monthLabel = useMonthLabel();

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

  const trendData = useMemo<TrendPoint[]>(() => {
    const points: TrendPoint[] = yearly.months.map((m, i) => {
      const prev = i > 0 ? (yearly.months[i - 1]?.totalBalance ?? null) : null;
      const momPct =
        prev && prev > 0 ? ((m.totalBalance - prev) / prev) * 100 : null;
      return {
        month: monthLabel(m.snapshotDate), // "5월"
        value: m.totalBalance,
        momPct,
      };
    });
    // 그래프 종점 = 현재 실시간 total. periodPct(첫박제→현재)와 종점을 일치시켜
    // "최근 N개월 추이" %가 그래프 기울기로 시각화되게 함(박제 끝점만 그리면 안 보임).
    const last = yearly.months[yearly.months.length - 1]?.totalBalance;
    const nowMom = last && last > 0 ? ((total - last) / last) * 100 : null;
    if (yearly.months.length > 0) {
      points.push({ month: t("trend_now"), value: total, momPct: nowMom, isCurrent: true });
    }
    return points;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearly.months, total]);

  // Y축 도메인 — 데이터 범위로 줌인(0-기준 스케일이면 수% 변동이 평평하게 눌림)
  const yDomain = useMemo(
    () => trendYDomain(trendData.map((d) => d.value)),
    [trendData],
  );

  // 추이 기간 전체 증감 — 첫 박제월 대비 현재 총자산
  const periodPct = useMemo(() => {
    const first = yearly.months[0]?.totalBalance;
    if (!first || first <= 0 || yearly.months.length < 2) return null;
    return ((total - first) / first) * 100;
  }, [yearly.months, total]);
  // 박제 개월수 기준 — trendData 에는 현재점이 더해져 있어 그걸 쓰면 +1 부풀려짐
  const periodMonths = yearly.months.length;

  // 전월 대비 증감 — 현재 총자산 vs 가장 최근 박제 스냅샷
  const lastSnapshot =
    yearly.months.length > 0 ? yearly.months[yearly.months.length - 1] : null;
  const diff = lastSnapshot ? total - lastSnapshot.totalBalance : null;
  const diffPct =
    lastSnapshot && lastSnapshot.totalBalance > 0
      ? ((total - lastSnapshot.totalBalance) / lastSnapshot.totalBalance) * 100
      : null;
  const lastSnapshotLabel = lastSnapshot
    ? monthLabel(lastSnapshot.snapshotDate)
    : "";

  // 수동 박제 — 지난달(targetMonth) upsert. 이미 저장됐어도 다시 눌러 갱신 가능.
  const isTargetSaved = yearly.targetMonthSaved;
  const targetMonthLabel = monthLabel(yearly.targetMonthDate);

  const handleTakeSnapshot = () => {
    if (createMutation.isPending) return;
    modals.openConfirmModal({
      centered: true,
      title: t("snapshot_title", { month: targetMonthLabel }),
      labels: {
        confirm: isTargetSaved ? t("snapshot_overwrite") : t("snapshot_save"),
        cancel: tCommon("cancel"),
      },
      children: (
        <Text size="sm">
          {isTargetSaved
            ? t("snapshot_body_overwrite", { month: targetMonthLabel })
            : t("snapshot_body_new", { month: targetMonthLabel })}
          <br />
          {t("snapshot_body_note")}
        </Text>
      ),
      onConfirm: async () => {
        try {
          await createMutation.mutateAsync();
          notifications.show({
            title: t("snapshot_done_title"),
            message: t("snapshot_done", { month: targetMonthLabel }),
            color: "green",
          });
        } catch (error) {
          notifications.show({
            title: t("snapshot_fail_title"),
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
                {t("total_asset")}
              </Text>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => setHidden((v) => !v)}
                aria-label={hidden ? t("show_amount") : t("hide_amount")}
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
                background: "var(--mantine-color-sage-0)",
                opacity: createMutation.isPending ? 0.5 : 1,
              }}
            >
              <Group gap={4} wrap="nowrap">
                <IconRefresh size={12} stroke={3} color="#647A5C" />
                <Text size="10px" fw={700} c="sage.6">
                  {isTargetSaved
                    ? t("update_month", { month: targetMonthLabel })
                    : t("record_month", { month: targetMonthLabel })}
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
              {t("won")}
            </Text>
          </Text>
          {diff !== null && (
            <Text
              size="sm"
              fw={600}
              c={diff >= 0 ? "positive.6" : "danger.5"}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {t("diff_vs_record", { month: lastSnapshotLabel })}{" "}
              {diff >= 0 ? "+" : "−"}
              {fmt(Math.abs(diff))}
              {t("won")}
              {diffPct !== null &&
                ` (${diff >= 0 ? "+" : "−"}${Math.abs(diffPct).toFixed(1)}%)`}
            </Text>
          )}
          {periodPct !== null && (
            <Group justify="space-between" align="center" mt={8} mb={-4}>
              <Text size="xs" c="dimmed" fw={600}>
                {t("trend_recent", { count: periodMonths })}
              </Text>
              <Text
                size="xs"
                fw={700}
                c={periodPct >= 0 ? "positive.6" : "danger.5"}
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
                  // 현재점(실시간)은 SnapshotMonth 구조가 아니라 드릴다운 대상 아님.
                  // selectedIdx 는 yearly.months 를 인덱싱하므로 범위 밖은 걸러냄.
                  if (idx !== null && idx < yearly.months.length) {
                    const target = idx;
                    setSelectedIdx((cur) => (cur === target ? null : target));
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <defs>
                  <linearGradient id="wealthTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C9473" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7C9473" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7C9473"
                  strokeWidth={2.5}
                  fill="url(#wealthTrend)"
                  dot={{ r: 2.5, fill: "#7C9473", strokeWidth: 0 }}
                  activeDot={{
                    r: 5,
                    fill: "#7C9473",
                    stroke: "var(--mantine-color-body)",
                    strokeWidth: 2,
                  }}
                />
                <Tooltip
                  content={<TrendTooltip />}
                  cursor={{
                    stroke: "#7C9473",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
                <YAxis hide domain={yDomain} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 9, fill: "#9C8F82" }}
                  axisLine={false}
                  tickLine={false}
                  interval={1}
                />
                {/* 0 기준 스케일이면 시가평가로 생긴 월별 손실/변동이 평평하게
                    뭉개짐 — 데이터 min/max ±2% 여백으로 타이트하게 (공용 차트와 동일) */}
                <YAxis
                  hide
                  domain={[
                    (dataMin: number) => Math.floor(dataMin * 0.98),
                    (dataMax: number) => Math.ceil(dataMax * 1.02),
                  ]}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Stack>
      </Card>

      <Modal
        opened={selectedMonth !== null}
        onClose={() => setSelectedIdx(null)}
        centered
        title={
          selectedMonth
            ? t("drilldown_title", {
                month: monthLabel(selectedMonth.snapshotDate),
              })
            : ""
        }
      >
        {selectedMonth && <SnapshotDrilldownPanel month={selectedMonth} />}
      </Modal>
    </>
  );
}
