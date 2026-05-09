import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { z } from "zod";

import { usePortfolioMutations } from "_features/portfolio/queries/use-mutations";
import { ApiResponseError } from "_libraries/fetch/api-response-error";

import { usePortfolioDetail as usePortfolioDetailQuery } from "../../queries/use-query";
import type { PortfolioBaseRequestType } from "../../types";

const HOUSEHOLD_ID = "h-mock-1";
const ACCOUNT_ID = "a-mock-broker";

interface UsePortfolioFormOptions {
  portfolioId?: string;
}

export function usePortfolioForm({ portfolioId }: UsePortfolioFormOptions) {
  const t = useTranslations("portfolio");
  const tg = useTranslations("general.common");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const fetchDetail = usePortfolioDetailQuery();
  const { createMutation, updateMutation, removeMutation } =
    usePortfolioMutations();

  const isUpdate = Boolean(portfolioId);

  const form = useForm<PortfolioBaseRequestType>({
    initialValues: {
      householdId: HOUSEHOLD_ID,
      accountId: ACCOUNT_ID,
      ticker: "",
      symbol: null,
      quantity: 0,
      avgPrice: 0,
      currentValue: 0,
      isArchived: false,
    },
    validate: zodResolver(
      z.object({
        ticker: z.string().min(1, t("ticker_required_message")),
        quantity: z.number(),
        avgPrice: z.number(),
        currentValue: z.number(),
      }),
    ),
  });

  useEffect(() => {
    if (!portfolioId) return;
    let cancelled = false;
    (async () => {
      const res = await fetchDetail(portfolioId);
      if (cancelled || !res) return;
      const d = res.body.data;
      form.setValues({
        householdId: d.householdId,
        accountId: d.accountId,
        ticker: d.ticker,
        symbol: d.symbol,
        quantity: d.quantity,
        avgPrice: d.avgPrice,
        currentValue: d.currentValue,
        isArchived: d.isArchived,
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioId]);

  const handleSubmit = async () => {
    try {
      if (isUpdate) {
        if (!portfolioId) throw new Error("No portfolioId for update");
        await updateMutation.mutateAsync({ portfolioId, ...form.values });
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
      router.replace(`/${routeParams.locale}/portfolio`);
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
    if (!portfolioId) return;
    modals.openConfirmModal({
      centered: true,
      title: tg("confirmtitle"),
      labels: { confirm: tg("confirm"), cancel: tg("cancel") },
      children: <span>{tg("want_to_delete")}</span>,
      onConfirm: async () => {
        await removeMutation.mutateAsync(portfolioId);
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("confirmyescontent"),
          color: "green",
        });
        router.replace(`/${routeParams.locale}/portfolio`);
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
