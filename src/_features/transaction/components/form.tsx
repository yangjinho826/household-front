"use client";

import {
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useSuspenseQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { queryKeys } from "_constants/queries";

import { useTransactionForm } from "../hooks/use-sub/use-form";

interface TransactionFormProps {
  transactionId?: string;
}

export default function TransactionForm({
  transactionId,
}: TransactionFormProps) {
  const t = useTranslations("transaction");
  const tTxType = useTranslations("enum.tx-type");
  const tg = useTranslations("general.common");

  const { data: txTypeData } = useSuspenseQuery({
    ...queryKeys.enum.options("tx-type"),
    staleTime: Infinity,
    gcTime: Infinity,
  });
  const txTypeOptions = useMemo(
    () =>
      (txTypeData.body.data ?? []).map((v) => ({
        value: v,
        label: tTxType(v),
      })),
    [txTypeData, tTxType],
  );

  const {
    form,
    isUpdate,
    isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  } = useTransactionForm({ transactionId });

  // 통장 + 카테고리 + 고정지출 데이터
  const { data: accountsData } = useSuspenseQuery(
    queryKeys.account.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: categoriesData } = useSuspenseQuery(
    queryKeys.category.list({ pageNo: 1, listSize: 100 }),
  );
  const { data: fixedData } = useSuspenseQuery(
    queryKeys.fixed.list({ pageNo: 1, listSize: 100 }),
  );

  const accounts = accountsData.body.data.content;
  const categories = categoriesData.body.data.content;
  const fixedItems = fixedData.body.data.content;

  const txType = form.values.txType;
  const isTransfer = txType === "TRANSFER";
  const isExpense = txType === "EXPENSE";

  const fixedOptions = useMemo(
    () =>
      fixedItems
        .filter((f) => !f.isArchived)
        .map((f) => ({ value: f.fixedId, label: f.name })),
    [fixedItems],
  );

  const accountOptions = useMemo(
    () =>
      accounts.map((a) => ({ value: a.accountId, label: a.name })),
    [accounts],
  );

  const toAccountOptions = useMemo(
    () =>
      accounts
        .filter((a) => a.accountId !== form.values.accountId)
        .map((a) => ({ value: a.accountId, label: a.name })),
    [accounts, form.values.accountId],
  );

  const categoryOptions = useMemo(
    () =>
      categories
        .filter((c) => (txType === "INCOME" ? c.kind === "INCOME" : c.kind === "EXPENSE"))
        .map((c) => ({ value: c.categoryId, label: c.name })),
    [categories, txType],
  );

  return (
    <Card>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Select
            {...form.getInputProps("txType")}
            label={t("tx_type")}
            data={txTypeOptions}
          />
          <NumberInput
            {...form.getInputProps("amount")}
            label={t("amount")}
            thousandSeparator=","
          />
          <DateInput
            value={
              form.values.txDate ? dayjs(form.values.txDate).toDate() : null
            }
            onChange={(d) =>
              form.setFieldValue(
                "txDate",
                d ? dayjs(d).format("YYYY-MM-DD") : "",
              )
            }
            error={form.errors.txDate}
            label={t("tx_date")}
            placeholder="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />

          {isTransfer ? (
            <>
              <Select
                {...form.getInputProps("accountId")}
                label={t("from_account")}
                placeholder={t("account_placeholder")}
                data={accountOptions}
                searchable
              />
              <Select
                {...form.getInputProps("toAccountId")}
                label={t("to_account")}
                placeholder={t("account_placeholder")}
                data={toAccountOptions}
                searchable
              />
            </>
          ) : (
            <>
              <Select
                {...form.getInputProps("accountId")}
                label={t("account")}
                placeholder={t("account_placeholder")}
                data={accountOptions}
                searchable
              />
              <Select
                {...form.getInputProps("categoryId")}
                label={t("category")}
                placeholder={t("category_placeholder")}
                data={categoryOptions}
                searchable
                clearable
              />
              {isExpense && (
                <Select
                  {...form.getInputProps("fixedExpenseId")}
                  label={t("fixed_expense_mapping")}
                  placeholder={t("fixed_expense_mapping_placeholder")}
                  data={fixedOptions}
                  searchable
                  clearable
                />
              )}
            </>
          )}

          <Textarea
            {...form.getInputProps("memo")}
            label={t("memo")}
            placeholder={t("memo_placeholder")}
            autosize
            minRows={2}
          />
          <Group grow mt="md">
            <Button
              type="button"
              variant="light"
              onClick={handleCancel}
              disabled={isPending}
            >
              {tg("cancel")}
            </Button>
            <Button type="submit" loading={isPending}>
              {isUpdate ? tg("update") : tg("create")}
            </Button>
          </Group>
          {isUpdate && (
            <Button
              type="button"
              variant="light"
              color="red"
              onClick={handleRemove}
              disabled={isPending}
              fullWidth
            >
              {tg("delete")}
            </Button>
          )}
        </Stack>
      </form>
    </Card>
  );
}
