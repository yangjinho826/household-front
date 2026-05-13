"use client";

import { ActionIcon, Group, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import AccountTable from "_features/account/components/table";
import { ACCOUNT_TYPE_ORDER } from "_features/account/constants";
import { useAccountSearch } from "_features/account/hooks/use-sub/use-search";
import type { AccountListItemType, AccountType } from "_features/account/types";
import FilterChip from "_features/common/components/filter-chip";
import { useEnumOptions } from "_features/enum/queries/use-query";

export default function AccountSection() {
  const t = useTranslations("account");
  const tType = useTranslations("enum.account-type");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const {
    accountType,
    setAccountType,
    result,
    params,
    handlePageChange,
  } = useAccountSearch();

  const { data: typeData } = useEnumOptions("account-type");
  const types = typeData.body.data as AccountType[];

  const items: AccountListItemType[] = useMemo(
    () => result?.content ?? [],
    [result],
  );
  const totalPages = result?.totalPages ?? 1;

  // "전체" 칩이면 타입별 그룹화. 특정 타입 칩이면 그대로 단일 리스트.
  const groupedByType = useMemo(() => {
    const map = new Map<AccountType, AccountListItemType[]>();
    for (const it of items) {
      const list = map.get(it.accountType) ?? [];
      list.push(it);
      map.set(it.accountType, list);
    }
    return ACCOUNT_TYPE_ORDER.filter((tp) => (map.get(tp) ?? []).length > 0)
      .map((tp) => ({ type: tp, items: map.get(tp) ?? [] }));
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
                totalPages={1}
                pageNo={1}
                listSize={params.listSize}
                onClickRow={(id) =>
                  router.push(`/${routeParams.locale}/account/${id}`)
                }
                onPageChange={handlePageChange}
                showPagination={false}
              />
            </Stack>
          ))}
        </Stack>
      ) : (
        <AccountTable
          items={items}
          totalPages={totalPages}
          pageNo={params.pageNo}
          listSize={params.listSize}
          onClickRow={(id) =>
            router.push(`/${routeParams.locale}/account/${id}`)
          }
          onPageChange={handlePageChange}
        />
      )}
    </Stack>
  );
}
