"use client";

import { Button, Card, Group, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";

import { useSampleContext } from "../context";
import { useSampleStore } from "../store";

import SampleDetailInput from "./detail-input";

export default function SampleDetail() {
  const t = useTranslations("sample");
  const tg = useTranslations("general.common");
  const editType = useSampleStore((s) => s.editType);
  const setEditType = useSampleStore((s) => s.setEditType);

  const {
    detail: {
      form: detailForm,
      selected,
      actions: { handleSubmit, onCancel, onRemove, handleResetDetail },
    },
  } = useSampleContext();

  const openDeleteModal = () => {
    if (!selected) return;
    modals.openConfirmModal({
      centered: true,
      title: tg("confirmtitle"),
      children: <Text size="sm">{tg("want_to_delete")}</Text>,
      labels: { confirm: tg("confirm"), cancel: tg("cancel") },
      onConfirm: async () => {
        await onRemove(selected);
        handleResetDetail();
        setEditType("read");
        notifications.show({
          title: tg("confirmyestitle"),
          message: tg("confirmyescontent"),
          color: "green",
        });
      },
    });
  };

  return (
    <Card>
      <form onSubmit={detailForm.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={700}>{t("detail_title")}</Text>
            {editType === "read" && (
              <Group gap="xs">
                <Button size="xs" onClick={() => setEditType("create")}>
                  {tg("create")}
                </Button>
                {selected && (
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => setEditType("update")}
                  >
                    {tg("update")}
                  </Button>
                )}
                {selected && (
                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    onClick={openDeleteModal}
                  >
                    {tg("delete")}
                  </Button>
                )}
              </Group>
            )}
          </Group>

          <SampleDetailInput />

          {editType !== "read" && (
            <Group grow>
              <Button type="button" variant="light" onClick={onCancel}>
                {tg("cancel")}
              </Button>
              <Button type="submit" loading={detailForm.submitting}>
                {editType === "create" ? tg("save") : tg("update")}
              </Button>
            </Group>
          )}
        </Stack>
      </form>
    </Card>
  );
}
