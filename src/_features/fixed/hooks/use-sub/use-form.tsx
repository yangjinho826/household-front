import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { z } from "zod";

import { useFixedMutations } from "_features/fixed/queries/use-mutations";
import { ApiResponseError } from "_libraries/fetch/api-response-error";

import { useFixedDetail as useFixedDetailQuery } from "../../queries/use-query";
import type { FixedBaseRequestType } from "../../types";

interface UseFixedFormOptions {
  fixedId?: string;
}

export function useFixedForm({ fixedId }: UseFixedFormOptions) {
  const t = useTranslations("fixed");
  const tg = useTranslations("general.common");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const fetchDetail = useFixedDetailQuery();
  const { createMutation, updateMutation, removeMutation } = useFixedMutations();

  const isUpdate = Boolean(fixedId);

  const form = useForm<FixedBaseRequestType>({
    initialValues: {
      name: "",
      amount: 0,
      dayOfMonth: 1,
      categoryId: null,
      color: null,
      icon: null,
      sortOrder: 0,
      isArchived: false,
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(1, t("name_required_message")),
        amount: z.number(),
        dayOfMonth: z.number().min(1).max(31),
      }),
    ),
  });

  useEffect(() => {
    if (!fixedId) return;
    let cancelled = false;
    (async () => {
      const res = await fetchDetail(fixedId);
      if (cancelled || !res) return;
      const d = res.body.data;
      form.setValues({
        name: d.name,
        amount: d.amount,
        dayOfMonth: d.dayOfMonth,
        categoryId: d.categoryId,
        color: d.color,
        icon: d.icon,
        sortOrder: d.sortOrder,
        isArchived: d.isArchived,
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedId]);

  const handleSubmit = async () => {
    try {
      if (isUpdate) {
        if (!fixedId) throw new Error("No fixedId for update");
        await updateMutation.mutateAsync({ fixedId, ...form.values });
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("update_has_been_completed"),
          color: "green",
        });
      } else {
        await createMutation.mutateAsync({ ...form.values });
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("register_has_been_completed"),
          color: "green",
        });
      }
      router.replace(`/${routeParams.locale}/fixed`);
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

  const handleRemove = () => {
    if (!fixedId) return;
    modals.openConfirmModal({
      centered: true,
      title: tg("confirmtitle"),
      labels: { confirm: tg("confirm"), cancel: tg("cancel") },
      children: <span>{tg("want_to_delete")}</span>,
      onConfirm: async () => {
        await removeMutation.mutateAsync(fixedId);
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("confirmyescontent"),
          color: "green",
        });
        router.replace(`/${routeParams.locale}/fixed`);
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    form,
    isUpdate,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  };
}
