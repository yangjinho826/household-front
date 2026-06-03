"use client";

import { Card, Group, Modal, Stack, Text, UnstyledButton } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import { ACCOUNT_TYPE_MANTINE_COLOR } from "_features/account/constants";
import type { AccountListItemType } from "_features/account/types";
import SubHeader from "_features/layout/components/sub-header";
import ManualAssetForm from "_features/manual-asset/components/form";
import { useManualAssetList } from "_features/manual-asset/queries/use-query";
import type { ManualAssetListItemType } from "_features/manual-asset/types";
import { ASSET_CLASS_COLOR } from "_features/portfolio/constants";
import { useMoney } from "_features/common/hooks/use-money";
import { queryKeys } from "_constants/queries";

import AllocationTrendChart from "./components/allocation-trend-chart";

// 시각 색상 매핑은 _features/account/constants.ts 에서 중앙 관리
const TYPE_COLOR = ACCOUNT_TYPE_MANTINE_COLOR;

/**
 * WealthSection — 자산 상세(sub-route /wealth).
 *
 * 총자산 hero·월별 추이·자산군 도넛은 홈 대시보드로 이관됨(TotalAssetHero).
 * 여기는 자산군 배분 추이 + 수동자산 + 통장 리스트만.
 */
export default function WealthSection() {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const tAssetClass = useTranslations("enum.asset-class");
  const tManual = useTranslations("manual-asset");
  const money = useMoney();

  const { data: overviewRes } = useSuspenseQuery(queryKeys.wealth.overview({}));
  const { data: manualAssetRes } = useManualAssetList();
  const manualAssetItems = manualAssetRes.body.data;

  // 부동산·연금 폼 모달 — modals.open() portal 은 QueryClientProvider 밖이라
  // 트리 안(<Modal>)에서 직접 렌더해야 useQuery/useMutation 컨텍스트가 잡힘
  const [manualAssetFormOpen, setManualAssetFormOpen] = useState(false);
  const [manualAssetEdit, setManualAssetEdit] = useState<
    ManualAssetListItemType | undefined
  >(undefined);

  const overview = overviewRes.body.data;
  const accounts: AccountListItemType[] = overview.accounts;
  // 수동자산 전용계좌(부동산·연금·금)는 통장 리스트에서 제외 — 별도 수동자산 섹션에서 관리
  const visibleAccounts = accounts.filter(
    (a) =>
      a.accountType !== "REAL_ESTATE" &&
      a.accountType !== "PENSION" &&
      a.accountType !== "COMMODITY",
  );

  const openManualAssetForm = (asset?: ManualAssetListItemType) => {
    setManualAssetEdit(asset);
    setManualAssetFormOpen(true);
  };

  return (
    <Stack gap="md">
      <SubHeader title="자산" back={`/${routeParams.locale}`} />

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
                    {money(m.currentValuation)}
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
                    ? `/invest/account/${a.accountId}`
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
                  {money(a.balance)}
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
