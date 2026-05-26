import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { z } from "zod";

import { useTransactionMutations } from "_features/transaction/queries/use-mutations";
import { getErrorMessage } from "_libraries/fetch/error-message";
import { todayIsoKst } from "_utilities/datetime";

import { useTransactionDetail as useTransactionDetailQuery } from "../../queries/use-query";
import type {
  TransactionBaseRequestType,
  TxType,
} from "../../types";

interface UseTransactionFormOptions {
  transactionId?: string;
  /**
   * 성공/취소/삭제 완료 후 호출. 시트 모드: close 호출 (라우트 이동 X).
   * 없으면 기본 동작 = router.replace(/transactions) 또는 router.back().
   */
  onDone?: () => void;
}

export function useTransactionForm({
  transactionId,
  onDone,
}: UseTransactionFormOptions) {
  const t = useTranslations("transaction");
  const tg = useTranslations("general.common");
  const te = useTranslations("error");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const fetchDetail = useTransactionDetailQuery();
  const { createMutation, updateMutation, removeMutation } =
    useTransactionMutations();

  const isUpdate = Boolean(transactionId);

  const todayDate = todayIsoKst();

  const form = useForm<TransactionBaseRequestType>({
    initialValues: {
      txType: "EXPENSE" as TxType,
      amount: 0,
      txDate: todayDate,
      accountId: "",
      toAccountId: null,
      categoryId: null,
      paidByUserId: null,
      fixedExpenseId: null,
      memo: null,
    },
    validate: zodResolver(
      z
        .object({
          txType: z.enum(["EXPENSE", "INCOME", "TRANSFER", "FIXED_EXPENSE"]),
          amount: z.number().positive(t("amount_required_message")),
          txDate: z.string().min(1),
          fixedExpenseId: z.string().nullable().optional(),
        })
        .superRefine((data, ctx) => {
          if (data.txType === "FIXED_EXPENSE" && !data.fixedExpenseId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["fixedExpenseId"],
              message: t("fixed_expense_item_required_message"),
            });
          }
        }),
    ),
  });

  useEffect(() => {
    if (!transactionId) return;
    let cancelled = false;
    (async () => {
      const res = await fetchDetail(transactionId);
      if (cancelled || !res) return;
      const d = res.body.data;
      form.setValues({
        txType: d.txType,
        amount: d.amount,
        txDate: d.txDate,
        accountId: d.accountId,
        toAccountId: d.toAccountId,
        categoryId: d.categoryId,
        paidByUserId: d.paidByUserId,
        fixedExpenseId: d.fixedExpenseId,
        memo: d.memo,
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  const handleSubmit = async () => {
    try {
      if (isUpdate) {
        if (!transactionId) throw new Error("No transactionId for update");
        await updateMutation.mutateAsync({ transactionId, ...form.values });
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
      if (onDone) {
        onDone();
      } else {
        router.replace(`/${routeParams.locale}/transactions`);
      }
    } catch (error) {
      notifications.show({
        title: tg("notificationstitle"),
        message: getErrorMessage(error, te),
        color: "red",
      });
    }
  };

  const handleRemove = () => {
    if (!transactionId) return;
    modals.openConfirmModal({
      centered: true,
      title: tg("confirmtitle"),
      labels: { confirm: tg("confirm"), cancel: tg("cancel") },
      children: <span>{tg("want_to_delete")}</span>,
      onConfirm: async () => {
        await removeMutation.mutateAsync(transactionId);
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("confirmyescontent"),
          color: "green",
        });
        if (onDone) {
          onDone();
        } else {
          router.replace(`/${routeParams.locale}/transactions`);
        }
      },
    });
  };

  const handleCancel = () => {
    if (onDone) {
      onDone();
    } else {
      router.back();
    }
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
