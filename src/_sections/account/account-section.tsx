"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import AccountTable from "_features/account/components/table";
import { useAccountSearch } from "_features/account/hooks/use-sub/use-search";
import type { AccountType } from "_features/account/types";
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

  const items = result?.content ?? [];
  const totalPages = result?.totalPages ?? 1;

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
    </Stack>
  );
}
