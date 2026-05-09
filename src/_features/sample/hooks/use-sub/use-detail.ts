import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { useSampleMutations } from "_features/sample/queries/use-mutations";
import { useSampleStore } from "_features/sample/store";
import { ApiResponseError } from "_libraries/fetch/api-response-error";

import { useSampleDetail as useSampleDetailQuery } from "../../queries/use-query";
import type { SampleBaseRequestType } from "../../types";

export function useSampleDetail() {
  const t = useTranslations("sample");
  const tg = useTranslations("general.common");

  const editType = useSampleStore((s) => s.editType);
  const setEditType = useSampleStore((s) => s.setEditType);
  const selectedSample = useSampleStore((s) => s.selectedSample);
  const setSelectedSample = useSampleStore((s) => s.setSelectedSample);
  const resetSelectedSample = useSampleStore((s) => s.resetSelectedSample);

  const fetchDetail = useSampleDetailQuery();
  const { createMutation, updateMutation, removeMutation } =
    useSampleMutations();

  const detailForm = useForm<SampleBaseRequestType>({
    initialValues: {
      sampleEmail: "",
      sampleTitle: "",
      sampleContent: "",
      sampleRadio: "react",
      sampleCheckbox: ["react"],
      sampleSelect: null,
      sampleNumberbox: 0,
      sampleDate: null,
      sampleFile: null,
    },
    validate: zodResolver(
      z.object({
        sampleEmail: z
          .string()
          .email(t("email_format_message"))
          .min(1, t("email_required_message")),
        sampleTitle: z.string().min(1, t("title_required_message")),
        sampleContent: z.string().min(1, t("content_required_message")),
      }),
    ),
  });

  const handleResetDetail = () => {
    detailForm.reset();
    resetSelectedSample();
  };

  const getDetail = async (sampleId: string) => {
    setSelectedSample(sampleId);
    const detailData = await fetchDetail(sampleId);
    if (detailData) {
      const res = detailData.body.data;
      detailForm.setValues({
        ...res,
        sampleDate: res.sampleDate ? new Date(res.sampleDate) : null,
        sampleFile: null,
      });
    }
  };

  const onCancel = () => {
    modals.openConfirmModal({
      centered: true,
      title: tg("confirmtitle"),
      labels: { confirm: tg("confirm"), cancel: tg("cancel") },
      onConfirm: () => {
        resetSelectedSample();
        detailForm.reset();
        setEditType("read");
      },
    });
  };

  const handleSubmit = async () => {
    if (editType === "read") return;
    try {
      let actionType = "";
      if (editType === "create") {
        await createMutation.mutateAsync({ ...detailForm.values });
        detailForm.reset();
        actionType = "create";
      } else if (editType === "update") {
        if (!selectedSample) throw new Error("No SampleId for update");
        await updateMutation.mutateAsync({
          sampleId: selectedSample,
          ...detailForm.values,
        });
        actionType = "update";
      }

      if (actionType) {
        notifications.show({
          title: tg("notificationstitle"),
          message:
            actionType === "create"
              ? tg("register_has_been_completed")
              : tg("update_has_been_completed"),
          color: "green",
        });
        setEditType("read");
      }
    } catch (error) {
      if (error instanceof ApiResponseError) {
        notifications.show({
          title: tg("notificationstitle"),
          message: error.errorMessage ?? error.message,
          color: "red",
        });
      }
    }
  };

  return {
    detailForm,
    getDetail,
    onCancel,
    onRemove: removeMutation.mutateAsync,
    selectedSample,
    handleSubmit,
    handleResetDetail,
  };
}
