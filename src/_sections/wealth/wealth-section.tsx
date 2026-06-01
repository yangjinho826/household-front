"use client";

import {
  Card,
  Group,
  Modal,
  Progress,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconRefresh } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { useAccountSnapshotMutations } from "_features/account-snapshot/queries/use-mutations";
import { ACCOUNT_TYPE_MANTINE_COLOR } from "_features/account/constants";
import type { AccountListItemType, AccountType } from "_features/account/types";
import ManualAssetForm from "_features/manual-asset/components/form";
import { useManualAssetList } from "_features/manual-asset/queries/use-query";
import type { ManualAssetListItemType } from "_features/manual-asset/types";
import PortfolioDonut from "_features/portfolio/components/portfolio-donut";
import { ASSET_CLASS_COLOR } from "_features/portfolio/constants";
import { queryKeys } from "_constants/queries";
import { getErrorMessage } from "_libraries/fetch/error-message";
import { fmt } from "_utilities/fmt";

import AllocationTrendChart from "./components/allocation-trend-chart";
import SnapshotDrilldownPanel from "./components/snapshot-drilldown-panel";

// 시각 색상 매핑은 _features/account/constants.ts 에서 중앙 관리
const TYPE_COLOR = ACCOUNT_TYPE_MANTINE_COLOR;

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

export default function WealthSection() {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const te = useTranslations("error");
  const tType = useTranslations("enum.account-type");
  const tAssetClass = useTranslations("enum.asset-class");
  const tManual = useTranslations("manual-asset");

  const { data: overviewRes } = useSuspenseQuery(
    queryKeys.wealth.overview({}),
  );
  const { data: manualAssetRes } = useManualAssetList();
  const manualAssetItems = manualAssetRes.body.data;

  const { createMutation } = useAccountSnapshotMutations();

  // 추이 차트에서 탭한 월 — 그달 계좌별 분해 패널 표시용
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // 부동산·연금 폼 모달 — modals.open() portal 은 QueryClientProvider 밖이라
  // 트리 안(<Modal>)에서 직접 렌더해야 useQuery/useMutation 컨텍스트가 잡힘
  const [manualAssetFormOpen, setManualAssetFormOpen] = useState(false);
  const [manualAssetEdit, setManualAssetEdit] = useState<
    ManualAssetListItemType | undefined
  >(undefined);

  const overview = overviewRes.body.data;
  // 백엔드 account.balance 는 INVESTMENT 도 cash + 평가금 합산해서 내려옴
  const accounts: AccountListItemType[] = overview.accounts;
  // 수동자산 전용계좌(부동산·연금·금)는 통장 리스트에서 제외 — 별도 수동자산 섹션에서 관리
  const visibleAccounts = accounts.filter(
    (a) =>
      a.accountType !== "REAL_ESTATE" &&
      a.accountType !== "PENSION" &&
      a.accountType !== "COMMODITY",
  );
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

  const byType = useMemo(() => {
    const types: AccountType[] = [
      "LIVING",
      "SAVINGS",
      "INVESTMENT",
      "REAL_ESTATE",
      "PENSION",
      "COMMODITY",
      "OTHER",
    ];
    return types
      .map((type) => {
        const accs = accounts.filter((a) => a.accountType === type);
        const sum = accs.reduce((s, a) => s + a.balance, 0);
        const pct = total > 0 ? (sum / total) * 100 : 0;
        return { type, sum, accs, pct };
      })
      .filter((t) => t.accs.length > 0);
  }, [accounts, total]);

  // 자산군별 배분 — asset_class 축 (계좌타입 분포와 다른 의미: 자산의 성격)
  const allocationItems = useMemo(
    () =>
      overview.allocation.currentAllocation.map((s) => ({
        key: s.assetClass,
        label: tAssetClass(s.assetClass),
        value: s.valuation,
        color: ASSET_CLASS_COLOR[s.assetClass],
      })),
    [overview.allocation, tAssetClass],
  );

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

  const openManualAssetForm = (asset?: ManualAssetListItemType) => {
    setManualAssetEdit(asset);
    setManualAssetFormOpen(true);
  };

  return (
    <Stack gap="md">
      <Title order={3}>자산</Title>

      <Card radius="xl" p="xl" shadow="md">
        <Stack gap={4}>
          <Group justify="space-between" align="center">
            <Text size="xs" fw={500} c="dimmed">
              총 자산
            </Text>
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
            style={{ fontVariantNumeric: "tabular-nums" }}
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

      {allocationItems.length > 0 && (
        <Card radius="lg">
          <Stack gap="sm">
            <Text size="sm" fw={700}>
              자산군 배분
            </Text>
            <PortfolioDonut items={allocationItems} />
          </Stack>
        </Card>
      )}

      {overview.allocation.allocationTrend.length > 1 && (
        <Card radius="lg">
          <Stack gap="sm">
            <Text size="sm" fw={700}>
              자산군 배분 추이
            </Text>
            <AllocationTrendChart data={overview.allocation.allocationTrend} />
          </Stack>
        </Card>
      )}

      <Card radius="lg">
        <Stack gap="sm">
          <Text size="sm" fw={700}>
            자산 분포
          </Text>
          <Stack gap="xs">
            {byType.map((t) => (
              <Stack key={t.type} gap={4}>
                <Group justify="space-between">
                  <Group gap={6}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: `var(--mantine-color-${TYPE_COLOR[t.type]}-5)`,
                      }}
                    />
                    <Text size="sm" fw={600}>
                      {tType(t.type)}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {t.pct.toFixed(0)}%
                    </Text>
                  </Group>
                  <Text
                    size="sm"
                    fw={700}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {fmt(t.sum)}원
                  </Text>
                </Group>
                <Progress
                  value={t.pct}
                  color={TYPE_COLOR[t.type]}
                  size="xs"
                  radius="xl"
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>

      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          {tManual("section_title")}
        </Text>
        <UnstyledButton onClick={() => openManualAssetForm()}>
          <Text size="xs" fw={700} c="info.5">
            + 추가
          </Text>
        </UnstyledButton>
      </Group>

      <Card radius="lg" p="xs">
        <Stack gap={0}>
          {manualAssetItems.length === 0 ? (
            <Text size="xs" c="dimmed" ta="center" py="md">
              {tManual("empty")}
            </Text>
          ) : (
            manualAssetItems.map((m) => (
              <UnstyledButton
                key={m.manualAssetId}
                onClick={() => openManualAssetForm(m)}
                style={{ padding: 12, borderRadius: 12 }}
              >
                <Group gap={12}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: `${ASSET_CLASS_COLOR[m.assetClass]}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Text
                      size="sm"
                      fw={700}
                      style={{ color: ASSET_CLASS_COLOR[m.assetClass] }}
                    >
                      {m.name.slice(0, 1)}
                    </Text>
                  </div>
                  <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" fw={600} truncate>
                      {m.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {tAssetClass(m.assetClass)}
                    </Text>
                  </Stack>
                  <Text
                    size="sm"
                    fw={700}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {fmt(m.currentValuation)}원
                  </Text>
                </Group>
              </UnstyledButton>
            ))
          )}
        </Stack>
      </Card>

      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          통장 ({visibleAccounts.length})
        </Text>
        <UnstyledButton
          onClick={() => router.push(`/${routeParams.locale}/account/new`)}
        >
          <Text size="xs" fw={700} c="info.5">
            + 추가
          </Text>
        </UnstyledButton>
      </Group>

      <Card radius="lg" p="xs">
        <Stack gap={0}>
          {visibleAccounts.map((a) => (
            <UnstyledButton
              key={a.accountId}
              onClick={() => {
                // INVESTMENT 는 포트폴리오 디테일로, 그 외는 일반 통장 디테일로
                const path =
                  a.accountType === "INVESTMENT"
                    ? `/wealth/account/${a.accountId}`
                    : `/account/${a.accountId}`;
                router.push(`/${routeParams.locale}${path}`);
              }}
              style={{ padding: 12, borderRadius: 12 }}
            >
              <Group gap={12}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: a.color
                      ? `${a.color}20`
                      : `var(--mantine-color-${TYPE_COLOR[a.accountType]}-0)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Text
                    size="sm"
                    fw={700}
                    style={{
                      color:
                        a.color ??
                        `var(--mantine-color-${TYPE_COLOR[a.accountType]}-5)`,
                    }}
                  >
                    {a.name.slice(0, 1)}
                  </Text>
                </div>
                <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={600} truncate>
                    {a.name}
                  </Text>
                </Stack>
                <Text
                  size="sm"
                  fw={700}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                  c={a.balance < 0 ? "danger.5" : undefined}
                >
                  {fmt(a.balance)}원
                </Text>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Card>

      <Modal
        opened={manualAssetFormOpen}
        onClose={() => setManualAssetFormOpen(false)}
        title={
          manualAssetEdit
            ? `${tManual("section_title")} 수정`
            : `${tManual("section_title")} 추가`
        }
        centered
      >
        <ManualAssetForm
          asset={manualAssetEdit}
          onClose={() => setManualAssetFormOpen(false)}
        />
      </Modal>
    </Stack>
  );
}
