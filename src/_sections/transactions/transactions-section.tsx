"use client";

import { ActionIcon, Group, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import TransactionSearch from "_features/transaction/components/search";
import TransactionTable from "_features/transaction/components/table";
import { useTransactionSearch } from "_features/transaction/hooks/use-sub/use-search";

export default function TransactionsSection() {
  const t = useTranslations("transaction");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const {
    searchform,
    onSearch,
    onReset,
    result,
    params,
    handlePageChange,
  } = useTransactionSearch();

  const items = result?.content ?? [];
  const totalPages = result?.totalPages ?? 1;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3}>{t("list_title")}</Title>
        <ActionIcon
          size="lg"
          radius="xl"
          onClick={() =>
            router.push(`/${routeParams.locale}/transactions/new`)
          }
          aria-label={t("add")}
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Group>

      <TransactionSearch
        form={searchform}
        onSearch={onSearch}
        onReset={onReset}
      />

      <TransactionTable
        items={items}
        totalPages={totalPages}
        pageNo={params.pageNo}
        listSize={params.listSize}
        onClickRow={(id) =>
          router.push(`/${routeParams.locale}/transactions/${id}`)
        }
        onPageChange={handlePageChange}
      />
    </Stack>
  );
}
