import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { z } from "zod";

import { useAccountMutations } from "_features/account/queries/use-mutations";
import { ApiResponseError } from "_libraries/fetch/api-response-error";

import { useAccountDetail as useAccountDetailQuery } from "../../queries/use-query";
import type {
  AccountBaseRequestType,
  AccountType,
} from "../../types";

interface UseAccountFormOptions {
  accountId?: string; // 있으면 update, 없으면 create
}

export function useAccountForm({ accountId }: UseAccountFormOptions) {
  const t = useTranslations("account");
  const tg = useTranslations("general.common");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const fetchDetail = useAccountDetailQuery();
  const { createMutation, updateMutation, removeMutation } =
    useAccountMutations();

  const isUpdate = Boolean(accountId);

  const form = useForm<AccountBaseRequestType>({
    initialValues: {
      name: "",
      accountType: "LIVING" as AccountType,
      startBalance: 0,
      color: null,
      icon: null,
      sortOrder: 0,
      isArchived: false,
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(1, t("name_required_message")),
        accountType: z.enum(["LIVING", "SAVINGS", "INVESTMENT"]),
        startBalance: z.number(),
      }),
    ),
  });

  // update 모드: id 받으면 detail 로드 → form 채움
  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;
    (async () => {
      const res = await fetchDetail(accountId);
      if (cancelled || !res) return;
      const d = res.body.data;
      form.setValues({
        name: d.name,
        accountType: d.accountType,
        startBalance: d.startBalance,
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
  }, [accountId]);

  const handleSubmit = async () => {
    try {
      if (isUpdate) {
        if (!accountId) throw new Error("No accountId for update");
        await updateMutation.mutateAsync({
          accountId,
          ...form.values,
        });
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
      router.replace(`/${routeParams.locale}/account`);
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
    if (!accountId) return;
    modals.openConfirmModal({
      centered: true,
      title: tg("confirmtitle"),
      labels: { confirm: tg("confirm"), cancel: tg("cancel") },
      children: <span>{tg("want_to_delete")}</span>,
      onConfirm: async () => {
        await removeMutation.mutateAsync(accountId);
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("confirmyescontent"),
          color: "green",
        });
        router.replace(`/${routeParams.locale}/account`);
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
