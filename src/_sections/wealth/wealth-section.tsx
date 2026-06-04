"use client";

import { Card, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import AssetForm from "_features/account/components/asset-form";
import {
  ACCOUNT_TYPE_HEX,
  ACCOUNT_TYPE_MANTINE_COLOR,
} from "_features/account/constants";
import { useAccountSheetStore } from "_features/account/store";
import type { AccountListItemType } from "_features/account/types";
import FormSheet from "_features/common/components/form-sheet";
import SubHeader from "_features/layout/components/sub-header";
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
  const tType = useTranslations("enum.account-type");
  const tAsset = useTranslations("account.asset");
  const tWealth = useTranslations("wealth");
  const tGeneral = useTranslations("general.common");
  const money = useMoney();

  const openAccountSheet = useAccountSheetStore((s) => s.open);

  const { data: overviewRes } = useSuspenseQuery(queryKeys.wealth.overview({}));

  // 수동자산 폼 시트 — 트리 안에서 직접 렌더해야 useQuery/useMutation 컨텍스트가 잡힘
  const [assetFormOpen, setAssetFormOpen] = useState(false);
  const [assetEdit, setAssetEdit] = useState<
    AccountListItemType | undefined
  >(undefined);

  const overview = overviewRes.body.data;
  const accounts: AccountListItemType[] = overview.accounts;
  // 수동자산 전용계좌(부동산·연금·금·적금)는 별도 자산 섹션에서, 나머지는 통장 리스트에서
  const manualAssets = accounts.filter((a) => a.isManualAsset);
  const visibleAccounts = accounts.filter((a) => !a.isManualAsset);

  const openAssetForm = (asset?: AccountListItemType) => {
    setAssetEdit(asset);
    setAssetFormOpen(true);
  };

  return (
    <Stack gap="md">
      <SubHeader title={tWealth("title")} back={`/${routeParams.locale}`} />

      {overview.allocation.allocationTrend.length > 1 && (
        <Card radius="lg">
          <Stack gap="sm">
            <Text size="sm" fw={700}>
              {tWealth("allocation_trend")}
            </Text>
            <AllocationTrendChart data={overview.allocation.allocationTrend} />
          </Stack>
        </Card>
      )}

      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          {tAsset("section_title")}
        </Text>
        <UnstyledButton onClick={() => openAssetForm()}>
          <Text size="xs" fw={700} c="info.5">
            + {tGeneral("create")}
          </Text>
        </UnstyledButton>
      </Group>

      <Card radius="lg" p="xs">
        <Stack gap={0}>
          {manualAssets.length === 0 ? (
            <Text size="xs" c="dimmed" ta="center" py="md">
              {tAsset("empty")}
            </Text>
          ) : (
            manualAssets.map((a) => {
              const assetColor = a.color ?? ACCOUNT_TYPE_HEX[a.accountType];
              return (
                <UnstyledButton
                  key={a.accountId}
                  onClick={() => openAssetForm(a)}
                  style={{ padding: 12, borderRadius: 12 }}
                >
                  <Group gap={12}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: `${assetColor}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Text size="sm" fw={700} style={{ color: assetColor }}>
                        {a.name.slice(0, 1)}
                      </Text>
                    </div>
                    <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={600} truncate>
                        {a.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {tType(a.accountType)}
                      </Text>
                    </Stack>
                    <Text
                      size="sm"
                      fw={700}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {money(a.balance)}
                    </Text>
                  </Group>
                </UnstyledButton>
              );
            })
          )}
        </Stack>
      </Card>

      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          {tWealth("accounts_count", { count: visibleAccounts.length })}
        </Text>
        <UnstyledButton onClick={() => openAccountSheet()}>
          <Text size="xs" fw={700} c="info.5">
            + {tGeneral("create")}
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

      <FormSheet
        opened={assetFormOpen}
        onClose={() => setAssetFormOpen(false)}
        title={
          assetEdit
            ? `${tAsset("section_title")} ${tGeneral("update")}`
            : `${tAsset("section_title")} ${tGeneral("create")}`
        }
      >
        <AssetForm
          account={assetEdit}
          onClose={() => setAssetFormOpen(false)}
        />
      </FormSheet>
    </Stack>
  );
}
