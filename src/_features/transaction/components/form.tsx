"use client";

import {
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

import { useTransactionForm } from "../hooks/use-sub/use-form";

interface TransactionFormProps {
  transactionId?: string;
  /** 성공/취소 후 호출. 시트 모드용. 없으면 라우트 이동 (기존 동작). */
  onDone?: () => void;
  /** true 면 외곽 Card 제거 — Drawer/시트 안에서 사용할 때 padding 이중 방지 */
  hideCard?: boolean;
}

export default function TransactionForm({
  transactionId,
  onDone,
  hideCard = false,
}: TransactionFormProps) {
  const t = useTranslations("transaction");
  const tTxType = useTranslations("enum.tx-type");
  const tg = useTranslations("general.common");

  const { data: txTypeData } = useSuspenseQuery({
    ...queryKeys.enum.options("tx-type"),
    staleTime: Infinity,
    gcTime: Infinity,
  });
  // VALUATION(평가조정)은 수동자산 폼에서 차액으로 자동 생성 — 거래 폼에서 직접 선택 불가.
  const txTypeOptions = useMemo(
    () =>
      (txTypeData.body.data ?? [])
        .filter((v) => v !== "VALUATION")
        .map((v) => ({
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
  } = useTransactionForm({ transactionId, onDone });

  // 통장 + 카테고리 + 고정지출 — 폼 옵션 1호출
  const { data: optionsData } = useSuspenseQuery(
    queryKeys.transaction.formOptions(),
  );
  const accounts = optionsData.body.data.accounts;
  const categories = optionsData.body.data.categories;
  const fixedItems = optionsData.body.data.fixedExpenses;

  const txType = form.values.txType;
  const isTransfer = txType === "TRANSFER";
  const isFixedExpense = txType === "FIXED_EXPENSE";

  const fixedOptions = useMemo(
    () =>
      fixedItems
        .filter((f) => !f.isArchived)
        .map((f) => ({ value: f.fixedId, label: f.name })),
    [fixedItems],
  );

  // 출발 통장 — 수동자산(부동산·연금·금)은 이체에서만 선택 가능(지출/수입 불가).
  const accountOptions = useMemo(
    () =>
      accounts
        .filter((a) => isTransfer || !a.isManualAsset)
        .map((a) => ({ value: a.accountId, label: a.name })),
    [accounts, isTransfer],
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

  // 거래 후 예상 잔액 — 선택한 계좌 balance ± 입력 금액.
  // 수정 모드는 기존 거래가 이미 balance 에 반영돼 "거래 후"가 부정확하므로 생략.
  const amountNum = Number(form.values.amount) || 0;

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.accountId === form.values.accountId),
    [accounts, form.values.accountId],
  );
  const selectedToAccount = useMemo(
    () => accounts.find((a) => a.accountId === form.values.toAccountId),
    [accounts, form.values.toAccountId],
  );

  const renderBalanceHint = (
    account: (typeof accounts)[number] | undefined,
    delta: number,
  ) => {
    if (isUpdate || !account) return null;
    const after = account.balance + delta;
    return (
      <Text size="xs" c="dimmed" mt={-6} ml={2}>
        {t("balance_current")} {fmt(account.balance)}
        {t("won")}
        {amountNum > 0 && (
          <>
            {" → "}
            <Text span fw={700} {...(after < 0 ? { c: "red" } : {})}>
              {fmt(after)}
              {t("won")}
            </Text>
          </>
        )}
      </Text>
    );
  };

  const formContent = (
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
            value={form.values.txDate || null}
            onChange={(value) => form.setFieldValue("txDate", value ?? "")}
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
              {renderBalanceHint(selectedAccount, -amountNum)}
              <Select
                {...form.getInputProps("toAccountId")}
                label={t("to_account")}
                placeholder={t("account_placeholder")}
                data={toAccountOptions}
                searchable
              />
              {renderBalanceHint(selectedToAccount, amountNum)}
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
              {renderBalanceHint(
                selectedAccount,
                txType === "INCOME" ? amountNum : -amountNum,
              )}
              <Select
                {...form.getInputProps("categoryId")}
                label={t("category")}
                placeholder={t("category_placeholder")}
                data={categoryOptions}
                searchable
                clearable
              />
              {isFixedExpense && (
                <Select
                  {...form.getInputProps("fixedExpenseId")}
                  label={t("fixed_expense_item")}
                  placeholder={t("fixed_expense_item_placeholder")}
                  data={fixedOptions}
                  searchable
                  required
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
  );

  return hideCard ? formContent : <Card>{formContent}</Card>;
}
