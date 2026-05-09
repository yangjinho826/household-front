import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { z } from "zod";

import { useHouseholdMutations } from "_features/household/queries/use-mutations";
import { ApiResponseError } from "_libraries/fetch/api-response-error";

import { useHouseholdDetail as useHouseholdDetailQuery } from "../../queries/use-query";
import type {
  HouseholdBaseRequestType,
  HouseholdCreateRequest,
} from "../../types";

interface UseHouseholdFormOptions {
  householdId?: string;
}

export function useHouseholdForm({ householdId }: UseHouseholdFormOptions) {
  const t = useTranslations("household");
  const tg = useTranslations("general.common");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const fetchDetail = useHouseholdDetailQuery();
  const { createMutation, updateMutation, removeMutation } =
    useHouseholdMutations();

  const isUpdate = Boolean(householdId);

  const todayDate = new Date().toISOString().slice(0, 10);

  const form = useForm<HouseholdCreateRequest>({
    initialValues: {
      name: "",
      description: null,
      currency: "KRW",
      startedAt: todayDate,
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(1, t("name_required_message")),
        currency: z.string().min(3).max(3),
      }),
    ),
  });

  useEffect(() => {
    if (!householdId) return;
    let cancelled = false;
    (async () => {
      const res = await fetchDetail(householdId);
      if (cancelled || !res) return;
      const d = res.body.data;
      form.setValues({
        name: d.name,
        description: d.description,
        currency: d.currency,
        startedAt: d.startedAt,
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [householdId]);

  const handleSubmit = async () => {
    try {
      if (isUpdate) {
        if (!householdId) throw new Error("No householdId for update");
        const updatePayload = {
          householdId,
          ownerId: "u-mock-owner",
          ...form.values,
        } satisfies HouseholdBaseRequestType & { householdId: string };
        await updateMutation.mutateAsync(updatePayload);
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
      router.replace(`/${routeParams.locale}/household`);
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
    if (!householdId) return;
    modals.openConfirmModal({
      centered: true,
      title: tg("confirmtitle"),
      labels: { confirm: tg("confirm"), cancel: tg("cancel") },
      children: <span>{tg("want_to_delete")}</span>,
      onConfirm: async () => {
        await removeMutation.mutateAsync(householdId);
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("confirmyescontent"),
          color: "green",
        });
        router.replace(`/${routeParams.locale}/household`);
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
