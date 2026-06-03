"use client";

import {
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import ColorPicker from "_features/common/components/color-picker";
import IconPicker from "_features/common/components/icon-picker";

import { useFixedForm } from "../hooks/use-sub/use-form";

interface FixedFormProps {
  fixedId?: string;
  /** 시트에서 사용 시 — 성공·취소 후 호출(시트 close) */
  onDone?: () => void;
  /** 시트 안에서는 Card 래퍼 없이(이미 패딩 있음) */
  hideCard?: boolean;
}

export default function FixedForm({
  fixedId,
  onDone,
  hideCard = false,
}: FixedFormProps) {
  const t = useTranslations("fixed");
  const tg = useTranslations("general.common");

  const {
    form,
    isUpdate,
    isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  } = useFixedForm({ fixedId, onDone });

  const Wrapper = hideCard ? Fragment : Card;

  return (
    <Wrapper>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            {...form.getInputProps("name")}
            label={t("name")}
            placeholder={t("name_placeholder")}
          />
          <NumberInput
            {...form.getInputProps("amount")}
            label={t("amount")}
            thousandSeparator=","
          />
          <NumberInput
            {...form.getInputProps("dayOfMonth")}
            label={t("day_of_month")}
            min={1}
            max={31}
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
    </Wrapper>
  );
}
