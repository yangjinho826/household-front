"use client";

import { ActionIcon, Group, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import AccountTable from "_features/account/components/table";
import { ACCOUNT_TYPE_ORDER, isAccountType } from "_features/account/constants";
import { useAccountSearch } from "_features/account/hooks/use-sub/use-search";
import type { AccountListItemType, AccountType } from "_features/account/types";
import FilterChip from "_features/common/components/filter-chip";
import { useEnumOptions } from "_features/enum/queries/use-query";
import { InfiniteSentinel } from "_libraries/query/infinite-sentinel";

export default function AccountSection() {
  const t = useTranslations("account");
  const tType = useTranslations("enum.account-type");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const {
    accountType,
    setAccountType,
    items,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAccountSearch();

  const { data: typeData } = useEnumOptions("account-type");
  // 백엔드 enum 응답(string[])에서 알려진 AccountType 만 통과 — as 단언 대신 런타임 검증
  const types = (typeData.body.data ?? []).filter(isAccountType);

  // "전체" 칩이면 타입별 그룹화. 특정 타입 칩이면 그대로 단일 리스트.
  const groupedByType = useMemo(() => {
    const map = new Map<AccountType, AccountListItemType[]>();
    for (const it of items) {
      const list = map.get(it.accountType) ?? [];
      list.push(it);
      map.set(it.accountType, list);
    }
    return ACCOUNT_TYPE_ORDER.filter((tp) => (map.get(tp) ?? []).length > 0).map(
      (tp) => ({ type: tp, items: map.get(tp) ?? [] }),
    );
  }, [items]);

  const showGrouped = accountType === undefined;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>{t("list_title")}</Title>
        <ActionIcon
          size="lg"
          radius="xl"
          onClick={() => router.push(`/${routeParams.locale}/account/new`)}
          aria-label={t("add")}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>

      <Group gap="xs">
        <FilterChip
          label="전체"
          active={accountType === undefined}
          onClick={() => setAccountType(undefined)}
        />
        {types.map((tp) => (
          <FilterChip
            key={tp}
            label={tType(tp)}
            active={accountType === tp}
            onClick={() => setAccountType(tp)}
          />
        ))}
      </Group>

      {showGrouped ? (
        <Stack gap="lg">
          {groupedByType.map((group) => (
            <Stack key={group.type} gap="xs">
              <Text size="sm" fw={700} c="dimmed" px={4}>
                {tType(group.type)}
              </Text>
              <AccountTable
                items={group.items}
                onClickRow={(id) =>
                  router.push(`/${routeParams.locale}/account/${id}`)
                }
              />
            </Stack>
          ))}
        </Stack>
      ) : (
        <AccountTable
          items={items}
          onClickRow={(id) =>
            router.push(`/${routeParams.locale}/account/${id}`)
          }
        />
      )}

      <InfiniteSentinel
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />
    </Stack>
  );
}
