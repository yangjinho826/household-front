"use client";

import {
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useTranslations } from "next-intl";

import { useSampleContext } from "../context";
import { useSampleStore } from "../store";

export default function SampleDetailInput() {
  const t = useTranslations("sample");
  const editType = useSampleStore((s) => s.editType);
  const disabled = editType === "read";
  const {
    detail: { form: detailForm },
  } = useSampleContext();

  return (
    <Stack gap="sm">
      <TextInput
        {...detailForm.getInputProps("sampleEmail")}
        label={t("email")}
        disabled={disabled}
      />
      <TextInput
        {...detailForm.getInputProps("sampleTitle")}
        label={t("title")}
        disabled={disabled}
      />
      <Textarea
        {...detailForm.getInputProps("sampleContent")}
        label={t("content")}
        disabled={disabled}
        autosize
        minRows={3}
      />
      <NumberInput
        {...detailForm.getInputProps("sampleNumberbox")}
        label={t("number")}
        disabled={disabled}
      />
      <Select
        {...detailForm.getInputProps("sampleSelect")}
        label={t("select")}
        data={[
          { value: "A", label: "A" },
          { value: "B", label: "B" },
        ]}
        disabled={disabled}
      />
      <DateInput
        {...detailForm.getInputProps("sampleDate")}
        label={t("date")}
        disabled={disabled}
        clearable
      />
    </Stack>
  );
}
