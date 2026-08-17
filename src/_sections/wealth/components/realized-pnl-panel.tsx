"use client";

import { Card, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useTranslations } from "next-intl";
import { useDeferredValue, useState } from "react";

import FormSheet from "_features/common/components/form-sheet";
import { useMoney } from "_features/common/hooks/use-money";
import TradeForm from "_features/portfolio/components/trade-form";
import {
  useAccountRealizedPnl,
  useItemRealizedPnl,
} from "_features/portfolio/queries/use-query";
import type {
  PortfolioTransactionItemType,
  RealizedPnlResponseType,
  RealizedPnlRowType,
} from "_features/portfolio/types";
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

// 기간 — 프리셋 3개 + 직접 지정. 전체가 기본(레일 라벨과 일치).
type Preset = "all" | "thisYear" | "lastYear" | "custom";

interface Range {
  from?: string;
  to?: string;
}

// 프리셋 → from/to. 전체는 from 생략(백엔드가 첫 매도일~오늘로 clamp).
function presetRange(preset: Preset, custom: Range): Range {
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
  if (preset === "custom") return custom;
  return { from: undefined, to: todayIsoKst() };
}

/**
 * 매매손익 행 → 매매 폼이 받는 거래 형태로 변환.
 *
 * 폼은 ptType/quantity/price/fee/txDate/memo/txId 만 쓰므로 나머지는 표시용
 * 자리만 채운다. 매도 행이라 ptType 은 항상 SELL.
 */
function toEditingTx(row: RealizedPnlRowType): PortfolioTransactionItemType {
  return {
    txId: row.txId,
    accountId: "",
    accountName: "",
    name: row.name ?? "",
    code: row.code,
    market: row.market,
    ptType: "SELL",
    quantity: row.quantity,
    price: row.sellPrice,
    total: row.amount,
    fee: row.fee,
    settlementAmount: row.settlement,
    txDate: row.txDate,
    memo: row.memo,
    realizedPnl: row.realizedPnl,
  };
}

// 종목/계좌 useSuspenseQuery 는 조건부 호출 불가 → fetch 를 분리하고 뷰만 공유
export default function RealizedPnlPanel({ portfolioId, accountId }: Props) {
  if (portfolioId) return <ItemRealizedPnl portfolioId={portfolioId} />;
  if (accountId) return <AccountRealizedPnl accountId={accountId} />;
  return null;
}

function usePeriod() {
  const [preset, setPreset] = useState<Preset>("all");
  const [custom, setCustom] = useState<Range>({});
  // 쿼리는 지연값으로 — 프리셋 전환 시 재-suspend 로 Drawer 가 깜빡이지 않게
  const deferredPreset = useDeferredValue(preset);
  const deferredCustom = useDeferredValue(custom);
  const range = presetRange(deferredPreset, deferredCustom);
  return {
    preset,
    setPreset,
    custom,
    setCustom,
    range,
    isStale: preset !== deferredPreset || custom !== deferredCustom,
  };
}

function ItemRealizedPnl({ portfolioId }: { portfolioId: string }) {
  const p = usePeriod();
  const { data } = useItemRealizedPnl(portfolioId, p.range.from, p.range.to);
  return <RealizedPnlView data={data.body.data} period={p} />;
}

function AccountRealizedPnl({ accountId }: { accountId: string }) {
  const p = usePeriod();
  const { data } = useAccountRealizedPnl(accountId, p.range.from, p.range.to);
  return <RealizedPnlView data={data.body.data} period={p} />;
}

interface ViewProps {
  data: RealizedPnlResponseType;
  period: ReturnType<typeof usePeriod>;
}

function RealizedPnlView({ data, period }: ViewProps) {
  const t = useTranslations("portfolio");
  const tGeneral = useTranslations("general");
  const money = useMoney();
  const { summary, rows } = data;
  const [editing, setEditing] = useState<RealizedPnlRowType | null>(null);

  return (
    <Stack gap="sm">
      {/* 기간 — 전체 / 올해 / 작년 / 직접 */}
      <SegmentedControl
        size="xs"
        fullWidth
        value={period.preset}
        onChange={(v) => period.setPreset(v as Preset)}
        data={[
          { label: t("period_all"), value: "all" },
          { label: t("period_this_year"), value: "thisYear" },
          { label: t("period_last_year"), value: "lastYear" },
          { label: t("period_custom"), value: "custom" },
        ]}
      />

      {period.preset === "custom" && (
        <Group grow gap="xs">
          <DatePickerInput
            size="xs"
            valueFormat="YYYY-MM-DD"
            placeholder={data.effectiveFrom}
            value={period.custom.from ?? null}
            onChange={(v) =>
              period.setCustom((c) => ({ ...c, from: v ?? undefined }))
            }
          />
          <DatePickerInput
            size="xs"
            valueFormat="YYYY-MM-DD"
            placeholder={data.effectiveTo}
            value={period.custom.to ?? null}
            onChange={(v) => period.setCustom((c) => ({ ...c, to: v ?? undefined }))}
          />
        </Group>
      )}

      {/* 지연 로딩 중 살짝 흐리게 — 깜빡임 대신 부드러운 전환 */}
      <Stack
        gap="sm"
        style={{
          opacity: period.isStale ? 0.5 : 1,
          transition: "opacity 0.15s ease",
        }}
      >
        {/* 요약 — 증권사 매매손익 헤더. sell/buy 는 gross, 실현손익은 net 이라
            제비용을 따로 보여줘야 숫자가 읽힌다. */}
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
            <SummaryLine label={t("sell_amount")} value={money(summary.sellAmount)} />
            <SummaryLine label={t("buy_amount")} value={money(summary.buyAmount)} />
            <SummaryLine label={t("total_fee")} value={money(summary.totalFee)} />
            <Text size="10px" c="dimmed">
              {data.effectiveFrom} ~ {data.effectiveTo}
            </Text>
          </Stack>
        </Card>

        {/* 매도 건별 — 증권사 거래내역 카드. 탭하면 그 매도를 수정한다
            (전량매도로 종목이 사라져도 여기서는 접근할 수 있다). */}
        <Stack gap="xs">
          <Text size="sm" fw={700}>
            {t("sell_history")} ({rows.length})
          </Text>
          {rows.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              {t("no_sell_history")}
            </Text>
          ) : (
            rows.map((r) => (
              <SellCard
                key={r.txId}
                row={r}
                onEdit={() => setEditing(r)}
                money={money}
                t={t}
                tGeneral={tGeneral}
              />
            ))
          )}
        </Stack>
      </Stack>

      <FormSheet
        opened={editing !== null}
        onClose={() => setEditing(null)}
        title={t("edit_trade")}
      >
        {editing?.portfolioItemId && (
          <TradeForm
            portfolioId={editing.portfolioItemId}
            editingTx={toEditingTx(editing)}
            onSuccess={() => setEditing(null)}
            onCancel={() => setEditing(null)}
          />
        )}
      </FormSheet>
    </Stack>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between">
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="xs" fw={600} style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </Text>
    </Group>
  );
}

interface SellCardProps {
  row: RealizedPnlRowType;
  onEdit: () => void;
  money: (v: number) => string;
  t: ReturnType<typeof useTranslations>;
  tGeneral: ReturnType<typeof useTranslations>;
}

/**
 * 매도 1건 카드 — 증권사 거래내역과 같은 좌우 2열 구성.
 * 거래일자/거래수량/수수료 는 왼쪽, 거래금액/거래단가/정산금액 은 오른쪽.
 */
function SellCard({ row, onEdit, money, t, tGeneral }: SellCardProps) {
  return (
    <Card
      radius="lg"
      p="md"
      onClick={onEdit}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onEdit();
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="baseline" wrap="nowrap">
          <Text size="sm" fw={800} c="info.6">
            {t("sell_record")}
          </Text>
          {row.name && (
            <Text size="sm" fw={700} truncate>
              {row.name}
            </Text>
          )}
        </Group>

        <Group align="flex-start" gap="md" grow>
          <Stack gap={2}>
            <Field label={t("label_tx_date")} value={row.txDate} />
            <Field
              label={t("quantity")}
              value={tGeneral("unit.stock", { count: row.quantity })}
            />
            <Field label={t("label_fee")} value={money(row.fee)} />
          </Stack>
          <Stack gap={2}>
            <Field label={t("sell_amount")} value={money(row.amount)} />
            <Field label={t("label_sell_price")} value={money(row.sellPrice)} />
            <Field
              label={t("settlement_amount")}
              value={money(row.settlement)}
              strong
            />
          </Stack>
        </Group>

        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            {t("realized_pnl")}
          </Text>
          <Group gap={6}>
            <Text
              size="sm"
              fw={800}
              c={profitColor(row.realizedPnl)}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatProfitAmount(row.realizedPnl, money)}
            </Text>
            <Text
              size="xs"
              fw={700}
              c={profitColor(row.realizedRate)}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatProfitRate(row.realizedRate)}
            </Text>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}

function Field({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <Group justify="space-between" gap="xs" wrap="nowrap">
      <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
        · {label}
      </Text>
      <Text
        size="xs"
        fw={strong ? 800 : 600}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </Text>
    </Group>
  );
}
