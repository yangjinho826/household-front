"use client";

import { Text } from "@mantine/core";
import { useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { fmt } from "_utilities/fmt";

// 서버에선 false, 클라 마운트 후 true — hydration-safe. recharts SSR prerender 회피용.
const noopSubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

export interface TrendPoint {
  month: string; // "5월"
  value: number;
  momPct: number | null; // 전월 대비 증감률
}

// 차트 점에 호버하면 그달 금액 + 전월대비 증감을 보여줌
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
          c={p.momPct >= 0 ? "positive.6" : "danger.5"}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          전월 {p.momPct >= 0 ? "+" : "−"}
          {Math.abs(p.momPct).toFixed(1)}%
        </Text>
      )}
    </div>
  );
}

interface Props {
  data: TrendPoint[];
  color?: string;
}

// 월별 추이 라인차트 — 표시 전용(drill-down 없음). 계좌/종목 화면에서 공용.
// 기본색 sage = 홈 총자산 hero(#7C9473)와 동일 — 추이 차트 전반 톤 통일.
export default function ValueTrendChart({ data, color = "#7C9473" }: Props) {
  // recharts ResponsiveContainer 는 SSR prerender 에서 깨질 수 있어 클라 마운트 후에만 그림
  const mounted = useMounted();

  // 같은 화면에 여러 차트가 떠도 gradient 가 안 겹치게 색 기반 id
  const gradientId = `trend-${color.replace("#", "")}`;

  // 마운트 전엔 차트 영역만 확보 (레이아웃 시프트 방지)
  if (!mounted) return <div className="chart-trend-wrap" />;

  return (
    <div className="chart-trend-wrap">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={data} margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={{ r: 2.5, fill: color, strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: color,
              stroke: "var(--mantine-color-body)",
              strokeWidth: 2,
            }}
          />
          <Tooltip
            content={<TrendTooltip />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
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
