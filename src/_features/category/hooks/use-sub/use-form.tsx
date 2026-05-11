import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { z } from "zod";

import { useCategoryMutations } from "_features/category/queries/use-mutations";
import { getErrorMessage } from "_libraries/fetch/error-message";

import { useCategoryDetail as useCategoryDetailQuery } from "../../queries/use-query";
import type {
  CategoryBaseRequestType,
  CategoryKind,
} from "../../types";

interface UseCategoryFormOptions {
  categoryId?: string;
}

export function useCategoryForm({ categoryId }: UseCategoryFormOptions) {
  const t = useTranslations("category");
  const tg = useTranslations("general.common");
  const te = useTranslations("error");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const fetchDetail = useCategoryDetailQuery();
  const { createMutation, updateMutation, removeMutation } =
    useCategoryMutations();

  const isUpdate = Boolean(categoryId);

  const form = useForm<CategoryBaseRequestType>({
    initialValues: {
      kind: "expense" as CategoryKind,
      name: "",
      color: null,
      icon: null,
      sortOrder: 0,
      isArchived: false,
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(1, t("name_required_message")),
        kind: z.enum(["income", "expense"]),
      }),
    ),
  });

  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    (async () => {
      const res = await fetchDetail(categoryId);
      if (cancelled || !res) return;
      const d = res.body.data;
      form.setValues({
        kind: d.kind,
        name: d.name,
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
  }, [categoryId]);

  const handleSubmit = async () => {
    try {
      if (isUpdate) {
        if (!categoryId) throw new Error("No categoryId for update");
        await updateMutation.mutateAsync({ categoryId, ...form.values });
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
      router.replace(`/${routeParams.locale}/category`);
    } catch (error) {
      notifications.show({
        title: tg("notificationstitle"),
        message: getErrorMessage(error, te),
        color: "red",
      });
    }
  };

  const handleRemove = () => {
    if (!categoryId) return;
    modals.openConfirmModal({
      centered: true,
      title: tg("confirmtitle"),
      labels: { confirm: tg("confirm"), cancel: tg("cancel") },
      children: <span>{tg("want_to_delete")}</span>,
      onConfirm: async () => {
        await removeMutation.mutateAsync(categoryId);
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("confirmyescontent"),
          color: "green",
        });
        router.replace(`/${routeParams.locale}/category`);
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
