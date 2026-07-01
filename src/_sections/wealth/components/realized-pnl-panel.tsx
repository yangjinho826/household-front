"use client";

import { Card, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useDeferredValue, useState } from "react";

import {
  useAccountRealizedPnl,
  useItemRealizedPnl,
} from "_features/portfolio/queries/use-query";
import type { RealizedPnlResponseType } from "_features/portfolio/types";
import { useMoney } from "_features/common/hooks/use-money";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";
import { nowKst, todayIsoKst } from "_utilities/datetime";

interface Props {
  // 둘 중 하나 — 종목 단위(portfolioId) 또는 계좌 누적(accountId)
  portfolioId?: string;
  accountId?: string;
}

// 기간 프리셋 — 자유 캘린더 대신. 전체가 기본(레일 라벨과 일치).
type Preset = "all" | "thisYear" | "lastYear";

// 프리셋 → from/to. 전체는 from 생략(백엔드가 첫 매도일~오늘로 clamp).
function presetRange(preset: Preset): { from?: string; to?: string } {
  if (preset === "thisYear") {
    return { from: nowKst().startOf("year").format("YYYY-MM-DD"), to: todayIsoKst() };
  }
  if (preset === "lastYear") {
    const y = nowKst().subtract(1, "year");
    return {
      from: y.startOf("year").format("YYYY-MM-DD"),
      to: y.endOf("year").format("YYYY-MM-DD"),
    };
  }
  return { from: undefined, to: todayIsoKst() };
}

// 종목/계좌 useSuspenseQuery 는 조건부 호출 불가 → fetch 를 분리하고 뷰만 공유
export default function RealizedPnlPanel({ portfolioId, accountId }: Props) {
  if (portfolioId) return <ItemRealizedPnl portfolioId={portfolioId} />;
  if (accountId) return <AccountRealizedPnl accountId={accountId} />;
  return null;
}

function ItemRealizedPnl({ portfolioId }: { portfolioId: string }) {
  const [preset, setPreset] = useState<Preset>("all");
  // 쿼리는 지연값으로 — 프리셋 전환 시 재-suspend 로 Drawer 가 깜빡이지 않게
  const deferredPreset = useDeferredValue(preset);
  const { from, to } = presetRange(deferredPreset);
  const { data } = useItemRealizedPnl(portfolioId, from, to);
  return (
    <RealizedPnlView
      data={data.body.data}
      preset={preset}
      onPresetChange={setPreset}
      isStale={preset !== deferredPreset}
    />
  );
}

function AccountRealizedPnl({ accountId }: { accountId: string }) {
  const [preset, setPreset] = useState<Preset>("all");
  const deferredPreset = useDeferredValue(preset);
  const { from, to } = presetRange(deferredPreset);
  const { data } = useAccountRealizedPnl(accountId, from, to);
  return (
    <RealizedPnlView
      data={data.body.data}
      preset={preset}
      onPresetChange={setPreset}
      isStale={preset !== deferredPreset}
    />
  );
}

interface ViewProps {
  data: RealizedPnlResponseType;
  preset: Preset;
  onPresetChange: (p: Preset) => void;
  isStale: boolean;
}

function RealizedPnlView({ data, preset, onPresetChange, isStale }: ViewProps) {
  const t = useTranslations("portfolio");
  const tGeneral = useTranslations("general");
  const money = useMoney();
  const { summary, rows } = data;

  return (
    <Stack gap="sm">
      {/* 기간 프리셋 — 전체 / 올해 / 작년 */}
      <SegmentedControl
        size="xs"
        fullWidth
        value={preset}
        onChange={(v) => onPresetChange(v as Preset)}
        data={[
          { label: t("period_all"), value: "all" },
          { label: t("period_this_year"), value: "thisYear" },
          { label: t("period_last_year"), value: "lastYear" },
        ]}
      />

      {/* 지연 로딩 중 살짝 흐리게 — 깜빡임 대신 부드러운 전환 */}
      <Stack
        gap="sm"
        style={{
          opacity: isStale ? 0.5 : 1,
          transition: "opacity 0.15s ease",
        }}
      >

      {/* 요약 — 증권사 매매손익 헤더 */}
      <Card radius="lg" p="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {t("realized_pnl")}
            </Text>
            <Group gap={6}>
              <Text
                size="sm"
                fw={800}
                c={profitColor(summary.totalRealized)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatProfitAmount(summary.totalRealized, money)}
              </Text>
              <Text
                size="sm"
                fw={700}
                c={profitColor(summary.totalRate)}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatProfitRate(summary.totalRate)}
              </Text>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              {t("sell_amount")}
            </Text>
            <Text size="xs" fw={600} style={{ fontVariantNumeric: "tabular-nums" }}>
              {money(summary.sellAmount)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              {t("buy_amount")}
            </Text>
            <Text size="xs" fw={600} style={{ fontVariantNumeric: "tabular-nums" }}>
              {money(summary.buyAmount)}
            </Text>
          </Group>
        </Stack>
      </Card>

      {/* 매도 건별 */}
      <Card radius="lg" p="md">
        <Stack gap="sm">
          <Text size="sm" fw={700}>
            {t("sell_history")} ({rows.length})
          </Text>
          {rows.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              {t("no_sell_history")}
            </Text>
          ) : (
            rows.map((r) => (
              <Group key={r.txId} justify="space-between">
                <div>
                  {/* 계좌 단위에서만 종목명 — 여러 종목 매도가 섞이므로 */}
                  {r.name && (
                    <Text size="sm" fw={700}>
                      {r.name}
                    </Text>
                  )}
                  <Text
                    size={r.name ? "xs" : "sm"}
                    fw={600}
                    c={r.name ? "dimmed" : undefined}
                  >
                    {r.txDate}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {tGeneral("unit.stock", { count: r.quantity })} @
                    {money(r.sellPrice)}
                  </Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text
                    size="sm"
                    fw={700}
                    c={profitColor(r.realizedPnl)}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatProfitAmount(r.realizedPnl, money)}
                  </Text>
                  <Text
                    size="xs"
                    fw={600}
                    c={profitColor(r.realizedRate)}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatProfitRate(r.realizedRate)}
                  </Text>
                </div>
              </Group>
            ))
          )}
        </Stack>
      </Card>
      </Stack>
    </Stack>
  );
}
