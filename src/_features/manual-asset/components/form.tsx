"use client";

import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { useManualAssetForm } from "../hooks/use-sub/use-form";
import type { ManualAssetListItemType } from "../types";

interface ManualAssetFormProps {
  asset?: ManualAssetListItemType;
  onClose?: () => void;
}

export default function ManualAssetForm({
  asset,
  onClose,
}: ManualAssetFormProps) {
  const t = useTranslations("manual-asset");
  const tAssetClass = useTranslations("enum.asset-class");
  const tg = useTranslations("general.common");
  const tGeneral = useTranslations("general");

  const { form, isUpdate, isPending, handleSubmit, handleRemove, handleCancel } =
    useManualAssetForm({ asset, onClose });

  const assetClassOptions = [
    { value: "REAL_ESTATE", label: tAssetClass("REAL_ESTATE") },
    { value: "PENSION", label: tAssetClass("PENSION") },
    { value: "COMMODITY", label: tAssetClass("COMMODITY") },
  ];

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <Select
          {...form.getInputProps("assetClass")}
          label={t("asset_class")}
          data={assetClassOptions}
          allowDeselect={false}
        />
        <TextInput
          {...form.getInputProps("name")}
          label={t("name")}
          placeholder={t("name_placeholder")}
        />
        <NumberInput
          {...form.getInputProps("currentValuation")}
          label={t("valuation")}
          placeholder={t("valuation_placeholder")}
          thousandSeparator=","
          min={0}
          rightSection={
            <Text size="xs" c="dimmed" pr={8}>
              {tGeneral("won")}
            </Text>
          }
        />
        <DateInput
          value={
            form.values.valuedAt ? dayjs(form.values.valuedAt).toDate() : null
          }
          onChange={(d) =>
            form.setFieldValue(
              "valuedAt",
              d ? dayjs(d).format("YYYY-MM-DD") : "",
            )
          }
          error={form.errors.valuedAt}
          label={t("valued_at")}
          description={t("valued_at_help")}
          valueFormat="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
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
}
