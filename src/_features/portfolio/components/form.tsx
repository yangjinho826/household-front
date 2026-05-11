"use client";

import {
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

import { queryKeys } from "_constants/queries";

import { usePortfolioForm } from "../hooks/use-sub/use-form";

interface PortfolioFormProps {
  portfolioId?: string;
}

export default function PortfolioForm({ portfolioId }: PortfolioFormProps) {
  const t = useTranslations("portfolio");
  const tg = useTranslations("general.common");

  const {
    form,
    isUpdate,
    isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  } = usePortfolioForm({ portfolioId });

  // INVESTMENT 통장만 노출
  const { data: accountsData } = useSuspenseQuery(
    queryKeys.account.list({ pageNo: 1, listSize: 100 }),
  );
  const investAccountOptions = useMemo(
    () =>
      accountsData.body.data.content
        .filter((a) => a.accountType === "INVESTMENT" && !a.isArchived)
        .map((a) => ({ value: a.accountId, label: a.name })),
    [accountsData],
  );

  // 신규 생성 시 INVESTMENT 계좌가 1개면 자동 선택
  useEffect(() => {
    if (isUpdate) return;
    if (form.values.accountId) return;
    if (investAccountOptions.length === 1) {
      const first = investAccountOptions[0];
      if (first) form.setFieldValue("accountId", first.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investAccountOptions, isUpdate]);

  return (
    <Card>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <Select
            {...form.getInputProps("accountId")}
            label={t("account")}
            placeholder={t("account_placeholder")}
            data={investAccountOptions}
            disabled={isUpdate}
            searchable
          />
          <TextInput
            {...form.getInputProps("ticker")}
            label={t("ticker")}
            placeholder={t("ticker_placeholder")}
          />
          <TextInput
            {...form.getInputProps("symbol")}
            label={t("symbol")}
            placeholder="005930"
          />
          <NumberInput
            {...form.getInputProps("currentPrice")}
            label={t("current_price")}
            placeholder={t("current_price_placeholder")}
            thousandSeparator=","
            min={0}
            rightSection={
              <Text size="xs" c="dimmed" pr={8}>
                원
              </Text>
            }
            description={isUpdate ? undefined : t("current_price_help")}
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
