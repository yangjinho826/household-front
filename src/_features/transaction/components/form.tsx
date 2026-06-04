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
  UnstyledButton,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { ACCOUNT_TYPE_HEX } from "_features/account/constants";
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
  // VALUATION(평가조정)은 통장 선택으로 자동 분기 — 유형 Select 에는 노출하지 않는다.
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

  // 통장 + 카테고리 + 고정지출 — 폼 옵션 1호출. 훅보다 먼저 읽어 accounts 를 넘긴다.
  const { data: optionsData } = useSuspenseQuery(
    queryKeys.transaction.formOptions(),
  );
  const accounts = optionsData.body.data.accounts;
  const categories = optionsData.body.data.categories;
  const fixedItems = optionsData.body.data.fixedExpenses;

  const {
    form,
    isUpdate,
    isPending,
    selectedAccount,
    handleSubmit,
    handleRemove,
    handleCancel,
  } = useTransactionForm({ transactionId, accounts, onDone });

  const txType = form.values.txType;
  const isValuation = txType === "VALUATION";
  const isTransfer = txType === "TRANSFER";
  const isFixedExpense = txType === "FIXED_EXPENSE";

  const fixedOptions = useMemo(
    () =>
      fixedItems
        .filter((f) => !f.isArchived)
        .map((f) => ({ value: f.fixedId, label: f.name })),
    [fixedItems],
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
        .filter((c) =>
          txType === "INCOME" ? c.kind === "INCOME" : c.kind === "EXPENSE",
        )
        .map((c) => ({ value: c.categoryId, label: c.name })),
    [categories, txType],
  );

  const amountNum = Number(form.values.amount) || 0;

  const selectedToAccount = useMemo(
    () => accounts.find((a) => a.accountId === form.values.toAccountId),
    [accounts, form.values.toAccountId],
  );

  // 거래 후 예상 잔액 — 수정 모드는 기존 거래가 이미 balance 에 반영돼 부정확하므로 생략.
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

  // 평가조정 생성 힌트 — 현재 잔액 + (새 평가액 입력 시) 증감 표시.
  const renderValuationHint = () => {
    if (isUpdate || !selectedAccount) return null;
    const diff = (Number(form.values.valuation) || 0) - selectedAccount.balance;
    return (
      <Text size="xs" c="dimmed" mt={-6} ml={2}>
        {t("balance_current")} {fmt(selectedAccount.balance)}
        {t("won")}
        {diff !== 0 && (
          <>
            {" · "}
            <Text span fw={700} c={diff > 0 ? "info.5" : "danger.5"}>
              {diff > 0
                ? t("valuation_hint_increase", { amount: fmt(diff) })
                : t("valuation_hint_decrease", { amount: fmt(-diff) })}
            </Text>
          </>
        )}
      </Text>
    );
  };

  const accountChips = (
    <Stack gap={4}>
      <Text size="sm" fw={500}>
        {t("account_select")}
      </Text>
      {/* 가로 스크롤 한 줄 — 통장이 많아도 높이 고정, 옆으로 스와이프. */}
      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {accounts.map((a) => {
          const selected = a.accountId === form.values.accountId;
          const color = a.color ?? ACCOUNT_TYPE_HEX[a.accountType];
          return (
            <UnstyledButton
              key={a.accountId}
              onClick={() => form.setFieldValue("accountId", a.accountId)}
              style={{
                flexShrink: 0,
                padding: "6px 12px",
                borderRadius: 999,
                border: `1.5px solid ${selected ? color : "var(--mantine-color-gray-3)"}`,
                background: selected ? `${color}18` : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: color,
                  flexShrink: 0,
                }}
              />
              <Text size="xs" fw={selected ? 700 : 500} c={selected ? undefined : "dimmed"}>
                {a.name}
              </Text>
            </UnstyledButton>
          );
        })}
      </div>
      {form.errors.accountId && (
        <Text size="xs" c="red">
          {form.errors.accountId}
        </Text>
      )}
    </Stack>
  );

  const valuationFields = isUpdate ? (
    // 기존 평가조정 거래 수정 — 방향 + 금액 직접 편집.
    <>
      <Select
        {...form.getInputProps("valuationDirection")}
        label={t("valuation_direction")}
        data={[
          { value: "INCREASE", label: t("valuation_increase") },
          { value: "DECREASE", label: t("valuation_decrease") },
        ]}
        allowDeselect={false}
      />
      <NumberInput
        {...form.getInputProps("amount")}
        label={t("valuation_amount")}
        thousandSeparator=","
        min={0}
      />
    </>
  ) : (
    // 신규 — 새 평가액(절대값) 입력 → 차액이 평가조정 거래로 생성.
    <>
      <NumberInput
        {...form.getInputProps("valuation")}
        label={t("valuation_new")}
        placeholder={t("valuation_new_placeholder")}
        thousandSeparator=","
        min={0}
      />
      {renderValuationHint()}
    </>
  );

  const normalFields = (
    <>
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
      {isTransfer ? (
        <>
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
    </>
  );

  const formContent = (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        {accountChips}

        {selectedAccount && (isValuation ? valuationFields : normalFields)}

        {selectedAccount && (
          <>
            <DateInput
              value={form.values.txDate || null}
              onChange={(value) => form.setFieldValue("txDate", value ?? "")}
              error={form.errors.txDate}
              label={t("tx_date")}
              placeholder="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
            />
            <Textarea
              {...form.getInputProps("memo")}
              label={t("memo")}
              placeholder={t("memo_placeholder")}
              autosize
              minRows={2}
            />
          </>
        )}

        <Group grow mt="md">
          <Button
            type="button"
            variant="light"
            onClick={handleCancel}
            disabled={isPending}
          >
            {tg("cancel")}
          </Button>
          <Button type="submit" loading={isPending} disabled={!selectedAccount}>
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
