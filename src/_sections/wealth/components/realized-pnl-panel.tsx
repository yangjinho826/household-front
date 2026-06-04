"use client";

import { Card, Group, Stack, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useState } from "react";

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
import { todayIsoKst } from "_utilities/datetime";

interface Props {
  // 둘 중 하나 — 종목 단위(portfolioId) 또는 계좌 누적(accountId)
  portfolioId?: string;
  accountId?: string;
  initialFrom?: string;
  initialTo?: string;
}

// 기본 범위 = 최근 1년. mantine v8 — 날짜 값은 "YYYY-MM-DD" 문자열.
function defaultRange(initialFrom?: string, initialTo?: string): [string, string] {
  const to = initialTo ?? todayIsoKst();
  const from = initialFrom ?? dayjs(to).subtract(1, "year").format("YYYY-MM-DD");
  return [from, to];
}

// 종목/계좌 useSuspenseQuery 는 조건부 호출 불가 → fetch 를 분리하고 뷰만 공유
export default function RealizedPnlPanel({
  portfolioId,
  accountId,
  initialFrom,
  initialTo,
}: Props) {
  if (portfolioId)
    return (
      <ItemRealizedPnl
        portfolioId={portfolioId}
        initialFrom={initialFrom}
        initialTo={initialTo}
      />
    );
  if (accountId)
    return (
      <AccountRealizedPnl
        accountId={accountId}
        initialFrom={initialFrom}
        initialTo={initialTo}
      />
    );
  return null;
}

interface FetchProps {
  initialFrom?: string;
  initialTo?: string;
}

function ItemRealizedPnl({
  portfolioId,
  initialFrom,
  initialTo,
}: FetchProps & { portfolioId: string }) {
  const [def] = useState(() => defaultRange(initialFrom, initialTo));
  const [from, setFrom] = useState<string | null>(def[0]);
  const [to, setTo] = useState<string | null>(def[1]);
  const { data } = useItemRealizedPnl(portfolioId, from ?? undefined, to ?? undefined);
  return (
    <RealizedPnlView
      data={data.body.data}
      from={from}
      to={to}
      onFromChange={setFrom}
      onToChange={setTo}
    />
  );
}

function AccountRealizedPnl({
  accountId,
  initialFrom,
  initialTo,
}: FetchProps & { accountId: string }) {
  const [def] = useState(() => defaultRange(initialFrom, initialTo));
  const [from, setFrom] = useState<string | null>(def[0]);
  const [to, setTo] = useState<string | null>(def[1]);
  const { data } = useAccountRealizedPnl(accountId, from ?? undefined, to ?? undefined);
  return (
    <RealizedPnlView
      data={data.body.data}
      from={from}
      to={to}
      onFromChange={setFrom}
      onToChange={setTo}
    />
  );
}

interface ViewProps {
  data: RealizedPnlResponseType;
  from: string | null;
  to: string | null;
  onFromChange: (d: string | null) => void;
  onToChange: (d: string | null) => void;
}

function RealizedPnlView({
  data,
  from,
  to,
  onFromChange,
  onToChange,
}: ViewProps) {
  const t = useTranslations("portfolio");
  const tGeneral = useTranslations("general");
  const money = useMoney();
  const { summary, rows } = data;
  const today = todayIsoKst();

  return (
    <Stack gap="sm">
      {/* 기간 자유 선택 — 시작일 ~ 종료일 (백엔드 fromDate/toDate) */}
      <Group grow gap="xs">
        <DateInput
          size="xs"
          label={t("period_from")}
          value={from}
          onChange={onFromChange}
          valueFormat="YYYY-MM-DD"
          maxDate={to ?? today}
        />
        <DateInput
          size="xs"
          label={t("period_to")}
          value={to}
          onChange={onToChange}
          valueFormat="YYYY-MM-DD"
          maxDate={today}
        />
      </Group>

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
  );
}
