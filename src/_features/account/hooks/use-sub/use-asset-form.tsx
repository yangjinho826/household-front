import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { useAccountMutations } from "_features/account/queries/use-mutations";
import type {
  AccountListItemType,
  ManualAssetAccountType,
} from "_features/account/types";
import { useTransactionMutations } from "_features/transaction/queries/use-mutations";
import { getErrorMessage } from "_libraries/fetch/error-message";
import { todayIsoKst } from "_utilities/datetime";

interface UseAssetFormOptions {
  /** 있으면 수정 모드 — 없으면 신규 등록 */
  account?: AccountListItemType;
  onClose?: () => void;
}

interface AssetFormValues {
  name: string;
  accountType: ManualAssetAccountType;
  valuation: number; // 현재 총 평가액(절대값). 수정 시 차액이 VALUATION 거래로 반영된다.
}

export function useAssetForm({ account, onClose }: UseAssetFormOptions) {
  const t = useTranslations("account.asset");
  const tg = useTranslations("general.common");
  const te = useTranslations("error");

  const {
    createMutation: accountCreate,
    updateMutation: accountUpdate,
    removeMutation: accountRemove,
  } = useAccountMutations();
  const { createMutation: txCreate } = useTransactionMutations();

  const isUpdate = Boolean(account);

  const form = useForm<AssetFormValues>({
    initialValues: {
      name: account?.name ?? "",
      accountType: (account?.accountType as ManualAssetAccountType) ?? "REAL_ESTATE",
      valuation: account?.balance ?? 0,
    },
    validateInputOnBlur: true,
    validate: zodResolver(
      z.object({
        name: z.string().min(1, t("name_required_message")),
        accountType: z.enum([
          "REAL_ESTATE",
          "PENSION",
          "COMMODITY",
          "SAVINGS_ASSET",
        ]),
        valuation: z.number().min(0, t("valuation_required_message")),
      }),
    ),
  });

  const handleSubmit = async () => {
    try {
      if (isUpdate && account) {
        // 이름·타입 변경분만 account 수정 (평가액은 거래로 따로 반영)
        const metaChanged =
          form.values.name !== account.name ||
          form.values.accountType !== account.accountType;
        if (metaChanged) {
          await accountUpdate.mutateAsync({
            accountId: account.accountId,
            name: form.values.name,
            accountType: form.values.accountType,
            startBalance: account.startBalance,
            color: account.color,
            icon: account.icon,
            sortOrder: account.sortOrder,
            isArchived: account.isArchived,
          });
        }
        // 현재 총 평가액 절대값 → (새값 − 현재잔액) 차액을 평가조정 거래로 생성
        const diff = form.values.valuation - account.balance;
        if (diff !== 0) {
          await txCreate.mutateAsync({
            txType: "VALUATION",
            amount: Math.abs(diff),
            valuationDirection: diff > 0 ? "INCREASE" : "DECREASE",
            txDate: todayIsoKst(),
            accountId: account.accountId,
            fixedExpenseId: null,
          });
        }
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("update_has_been_completed"),
          color: "green",
        });
      } else {
        // 신규 자산 = 통장 생성. 초기 평가액이 곧 start_balance.
        await accountCreate.mutateAsync({
          name: form.values.name,
          accountType: form.values.accountType,
          startBalance: form.values.valuation,
          color: null,
          icon: null,
          sortOrder: 0,
          isArchived: false,
        });
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("register_has_been_completed"),
          color: "green",
        });
      }
      onClose?.();
    } catch (error) {
      notifications.show({
        title: tg("notificationstitle"),
        message: getErrorMessage(error, te),
        color: "red",
      });
    }
  };

  const handleRemove = () => {
    if (!account) return;
    modals.openConfirmModal({
      centered: true,
      title: tg("confirmtitle"),
      labels: { confirm: tg("confirm"), cancel: tg("cancel") },
      children: <span>{tg("want_to_delete")}</span>,
      onConfirm: async () => {
        try {
          await accountRemove.mutateAsync(account.accountId);
          notifications.show({
            title: tg("notificationstitle"),
            message: tg("confirmyescontent"),
            color: "green",
          });
          onClose?.();
        } catch (error) {
          notifications.show({
            title: tg("notificationstitle"),
            message: getErrorMessage(error, te),
            color: "red",
          });
        }
      },
    });
  };

  const handleCancel = () => onClose?.();

  return {
    form,
    isUpdate,
    isPending:
      accountCreate.isPending ||
      accountUpdate.isPending ||
      accountRemove.isPending ||
      txCreate.isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  };
}
