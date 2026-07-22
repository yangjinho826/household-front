"use client";

import { Card, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import { Fragment, useMemo } from "react";

import ColorPicker from "_features/common/components/color-picker";
import FormActions from "_features/common/components/form-actions";
import IconPicker from "_features/common/components/icon-picker";
import { useEnumOptions } from "_features/enum/queries/use-query";

import { useAccountForm } from "../hooks/use-sub/use-form";

interface AccountFormProps {
  accountId?: string; // 있으면 update, 없으면 create
  /** 시트에서 사용 시 — 성공·취소 후 호출(시트 close) */
  onDone?: () => void;
  /** 시트 안에서는 Card 래퍼 없이(이미 패딩 있음) */
  hideCard?: boolean;
}

/**
 * 사용자가 직접 만들 수 있는 통장 타입.
 * 부동산·연금·금·적금(SAVINGS_ASSET) 등 수동자산 전용계좌는 자산 화면에서 생성하므로 제외.
 */
const CREATABLE_ACCOUNT_TYPES = ["LIVING", "SAVINGS", "INVESTMENT"] as const;

export default function AccountForm({
  accountId,
  onDone,
  hideCard = false,
}: AccountFormProps) {
  const t = useTranslations("account");
  const tType = useTranslations("enum.account-type");
  const tg = useTranslations("general.common");

  const { form, isUpdate, isPending, handleSubmit, handleRemove, handleCancel } =
    useAccountForm({ accountId, onDone });

  const Wrapper = hideCard ? Fragment : Card;

  const { data: typeData } = useEnumOptions("account-type");
  const typeOptions = useMemo(
    () =>
      (typeData.body.data ?? [])
        .filter((v) =>
          (CREATABLE_ACCOUNT_TYPES as readonly string[]).includes(v),
        )
        .map((v) => ({ value: v, label: tType(v) })),
    [typeData, tType],
  );

  return (
    <Wrapper>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            {...form.getInputProps("name")}
            label={t("name")}
            placeholder={t("name_placeholder")}
          />
          <Select
            {...form.getInputProps("accountType")}
            label={t("type")}
            data={typeOptions}
          />
          <NumberInput
            {...form.getInputProps("startBalance")}
            label={t("balance")}
            placeholder={t("balance_placeholder")}
            thousandSeparator=","
          />
          <ColorPicker
            value={form.values.color}
            onChange={(c) => form.setFieldValue("color", c)}
            label={t("color")}
          />
          <IconPicker
            value={form.values.icon}
            onChange={(i) => form.setFieldValue("icon", i)}
            label={t("icon")}
          />
          <FormActions
            submitLabel={isUpdate ? tg("update") : tg("create")}
            isPending={isPending}
            onCancel={handleCancel}
            cancelLabel={tg("cancel")}
            onRemove={isUpdate ? handleRemove : undefined}
            removeLabel={tg("delete")}
            sticky={hideCard}
          />
        </Stack>
      </form>
    </Wrapper>
  );
}
