import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { z } from "zod";

import { usePortfolioMutations } from "_features/portfolio/queries/use-mutations";
import { getErrorMessage } from "_libraries/fetch/error-message";

import { usePortfolioDetail as usePortfolioDetailQuery } from "../../queries/use-query";

interface UsePortfolioFormOptions {
  portfolioId?: string;
}

interface FormValues {
  accountId: string;
  ticker: string;
  symbol: string | null;
  currentPrice: number;
  isArchived: boolean;
}

export function usePortfolioForm({ portfolioId }: UsePortfolioFormOptions) {
  const t = useTranslations("portfolio");
  const tg = useTranslations("general.common");
  const te = useTranslations("error");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const fetchDetail = usePortfolioDetailQuery();
  const { createMutation, updateMutation } = usePortfolioMutations();

  const isUpdate = Boolean(portfolioId);

  const form = useForm<FormValues>({
    initialValues: {
      accountId: "",
      ticker: "",
      symbol: null,
      currentPrice: 0,
      isArchived: false,
    },
    validateInputOnBlur: true,
    validate: zodResolver(
      z.object({
        accountId: z.string().min(1, t("account_required_message")),
        ticker: z.string().min(1, t("ticker_required_message")),
        currentPrice: z.number(),
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
        accountId: d.accountId,
        ticker: d.ticker,
        symbol: d.symbol,
        currentPrice: d.currentPrice,
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
        await updateMutation.mutateAsync({
          portfolioId,
          currentPrice: form.values.currentPrice,
          ticker: form.values.ticker,
          symbol: form.values.symbol,
          isArchived: form.values.isArchived,
        });
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("update_has_been_completed"),
          color: "green",
        });
      } else {
        // 종목 메타 등록 (qty=0 시작) — 매수는 디테일에서 별도
        await createMutation.mutateAsync({
          ticker: form.values.ticker,
          symbol: form.values.symbol,
          currentPrice: form.values.currentPrice,
          accountId: form.values.accountId,
        });
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("register_has_been_completed"),
          color: "green",
        });
      }
      router.replace(`/${routeParams.locale}/portfolio`);
    } catch (error) {
      notifications.show({
        title: tg("notificationstitle"),
        message: getErrorMessage(error, te),
        color: "red",
      });
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
        await updateMutation.mutateAsync({ portfolioId, isArchived: true });
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
    isPending: createMutation.isPending || updateMutation.isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  };
}
