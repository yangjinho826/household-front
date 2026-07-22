"use client";

import { Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { ASSET_CLASS_COLOR } from "_features/portfolio/constants";
import type { AssetClass } from "_features/portfolio/types";
import type { AllocationTrendPoint } from "_features/wealth/types";
import { useMonthLabel } from "_features/common/hooks/use-month-label";
import { useMoney } from "_features/common/hooks/use-money";

// 서버에선 false, 클라 마운트 후 true — hydration-safe. recharts SSR prerender 회피용.
const noopSubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

// 스택 순서 = ASSET_CLASS_COLOR 키 순서(STOCK→…→OTHER). 매월 동일 순서 보장.
const ASSET_CLASS_ORDER = Object.keys(ASSET_CLASS_COLOR) as AssetClass[];

interface ChartRow {
  month: string; // "5월"
  [assetClass: string]: string | number;
}

function buildRows(
  data: AllocationTrendPoint[],
  monthLabel: (isoDate: string) => string,
): {
  rows: ChartRow[];
  classes: AssetClass[];
} {
  // 기간 내 한 번이라도 등장한 자산군만 — 없는 군은 차트에서 제외
  const present = new Set<AssetClass>();
  for (const p of data) {
    for (const s of p.slices) present.add(s.assetClass);
  }
  const classes = ASSET_CLASS_ORDER.filter((c) => present.has(c));

  const rows = data.map((p) => {
    const row: ChartRow = { month: monthLabel(p.snapshotDate) };
    // 없는 슬라이스는 0 패딩 — 스택 영역 라인 끊김 방지
    for (const c of classes) row[c] = 0;
    for (const s of p.slices) row[s.assetClass] = s.valuation;
    return row;
  });
  return { rows, classes };
}

interface Props {
  data: AllocationTrendPoint[];
}

// 월별 자산군 배분추이 — 스택 영역 차트. 표시 전용.
export default function AllocationTrendChart({ data }: Props) {
  const tAssetClass = useTranslations("enum.asset-class");
  const monthLabel = useMonthLabel();
  const money = useMoney();
  // recharts ResponsiveContainer 는 SSR prerender 에서 깨질 수 있어 클라 마운트 후에만 그림
  const mounted = useMounted();

  const { rows, classes } = buildRows(data, monthLabel);

  // 마운트 전엔 차트 영역만 확보 (레이아웃 시프트 방지)
  if (!mounted) return <div className="chart-trend-wrap" />;

  return (
    <div className="chart-trend-wrap">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={rows} margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
          {classes.map((c) => (
            <Area
              key={c}
              type="monotone"
              dataKey={c}
              stackId="allocation"
              stroke={ASSET_CLASS_COLOR[c]}
              strokeWidth={1.5}
              fill={ASSET_CLASS_COLOR[c]}
              fillOpacity={0.7}
            />
          ))}
          <Tooltip
            // 자산군 수만큼 줄이 늘어나는 스택 툴팁 — 96px 차트에서 세로 이탈 허용해 잘림 방지
            allowEscapeViewBox={{ x: false, y: true }}
            wrapperStyle={{ zIndex: 5 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
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
                  {[...payload].reverse().map((entry) => {
                    const c = entry.dataKey as AssetClass;
                    const v = Number(entry.value ?? 0);
                    if (v === 0) return null;
                    return (
                      <Text
                        key={c}
                        size="xs"
                        fw={700}
                        style={{
                          color: ASSET_CLASS_COLOR[c],
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {tAssetClass(c)} {money(v)}
                      </Text>
                    );
                  })}
                </div>
              );
            }}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 9, fill: "#9C8F82" }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
