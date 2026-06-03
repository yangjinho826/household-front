"use client";

import {
  Button,
  Card,
  Group,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import { useHouseholdForm } from "../hooks/use-sub/use-form";

interface HouseholdFormProps {
  householdId?: string;
  /** 시트에서 사용 시 — 성공·취소 후 호출(시트 close) */
  onDone?: () => void;
  /** 시트 안에서는 Card 래퍼 없이(이미 패딩 있음) */
  hideCard?: boolean;
}

export default function HouseholdForm({
  householdId,
  onDone,
  hideCard = false,
}: HouseholdFormProps) {
  const t = useTranslations("household");
  const tg = useTranslations("general.common");

  const {
    form,
    isUpdate,
    isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  } = useHouseholdForm({ householdId, onDone });

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
          <Textarea
            {...form.getInputProps("description")}
            label={t("description")}
            autosize
            minRows={2}
          />
          <TextInput
            {...form.getInputProps("currency")}
            label={t("currency")}
            placeholder="KRW"
          />
          <DateInput
            value={
              form.values.startedAt
                ? dayjs(form.values.startedAt).toDate()
                : null
            }
            onChange={(d) =>
              form.setFieldValue(
                "startedAt",
                d ? dayjs(d).format("YYYY-MM-DD") : "",
              )
            }
            error={form.errors.startedAt}
            label={t("started_at")}
            placeholder="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
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
