import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { z } from "zod";

import { usePortfolioMutations } from "_features/portfolio/queries/use-mutations";
import type { Market } from "_features/portfolio/types";
import { getErrorMessage } from "_libraries/fetch/error-message";

import { usePortfolioDetail as usePortfolioDetailQuery } from "../../queries/use-query";

interface UsePortfolioFormOptions {
  portfolioId?: string;
}

interface FormValues {
  accountId: string;
  market: Market;
  code: string;
  name: string;
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
  const { createMutation, updateMutation, lookupMutation } = usePortfolioMutations();

  const isUpdate = Boolean(portfolioId);

  const form = useForm<FormValues>({
    initialValues: {
      accountId: "",
      market: "KRX_KOSPI",
      code: "",
      name: "",
      currentPrice: 0,
      isArchived: false,
    },
    validateInputOnBlur: true,
    validate: zodResolver(
      z
        .object({
          accountId: z.string().min(1, t("account_required_message")),
          market: z.enum(["KRX_KOSPI", "KRX_KOSDAQ", "NASDAQ", "NYSE", "OTHER"]),
          code: z.string(),
          name: z.string().min(1, t("name_required_message")),
          currentPrice: z.number().positive(t("current_price_required_message")),
        })
        .superRefine((val, ctx) => {
          // OTHER (야후 미지원) 면 code 빈문자열 OK, 그 외엔 필수
          if (val.market !== "OTHER" && val.code.trim().length < 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("code_required_message"),
              path: ["code"],
            });
          }
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
        market: d.market,
        code: d.code,
        name: d.name,
        currentPrice: d.currentPrice,
        isArchived: d.isArchived,
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioId]);

  const handleLookup = async () => {
    const market = form.values.market;
    const code = form.values.code.trim();
    if (!code) return;
    try {
      const res = await lookupMutation.mutateAsync({ market, code });
      const d = res.body.data;
      if (!isUpdate) form.setFieldValue("name", d.name);
      form.setFieldValue("currentPrice", d.currentPrice);
      notifications.show({
        title: tg("notificationstitle"),
        message: `${d.name} · ${d.yahooSymbol}`,
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: tg("notificationstitle"),
        message: getErrorMessage(error, te),
        color: "red",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (isUpdate) {
        if (!portfolioId) throw new Error("No portfolioId for update");
        await updateMutation.mutateAsync({
          portfolioId,
          currentPrice: form.values.currentPrice,
          name: form.values.name,
          code: form.values.code,
          market: form.values.market,
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
          name: form.values.name,
          code: form.values.code,
          market: form.values.market,
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
    isLookupPending: lookupMutation.isPending,
    handleLookup,
    handleSubmit,
    handleRemove,
    handleCancel,
  };
}
