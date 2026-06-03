import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { useManualAssetMutations } from "_features/manual-asset/queries/use-mutations";
import type {
  ManualAssetClass,
  ManualAssetListItemType,
} from "_features/manual-asset/types";
import { getErrorMessage } from "_libraries/fetch/error-message";

interface UseManualAssetFormOptions {
  asset?: ManualAssetListItemType;
  onClose?: () => void;
}

interface FormValues {
  name: string;
  assetClass: ManualAssetClass;
  currentValuation: number;
  valuedAt: string; // YYYY-MM-DD
}

export function useManualAssetForm({
  asset,
  onClose,
}: UseManualAssetFormOptions) {
  const t = useTranslations("manual-asset");
  const tg = useTranslations("general.common");
  const te = useTranslations("error");

  const { createMutation, updateMutation, removeMutation } =
    useManualAssetMutations();
  const isUpdate = Boolean(asset);

  const form = useForm<FormValues>({
    initialValues: {
      name: asset?.name ?? "",
      assetClass: asset?.assetClass ?? "REAL_ESTATE",
      currentValuation: asset?.currentValuation ?? 0,
      valuedAt: asset?.valuedAt ?? dayjs().format("YYYY-MM-DD"),
    },
    validateInputOnBlur: true,
    validate: zodResolver(
      z.object({
        name: z.string().min(1, t("name_required_message")),
        assetClass: z.enum(["REAL_ESTATE", "PENSION", "COMMODITY", "SAVINGS"]),
        currentValuation: z.number().positive(t("valuation_required_message")),
        valuedAt: z.string().min(1, t("valued_at_required_message")),
      }),
    ),
  });

  const handleSubmit = async () => {
    try {
      if (isUpdate && asset) {
        await updateMutation.mutateAsync({
          manualAssetId: asset.manualAssetId,
          name: form.values.name,
          assetClass: form.values.assetClass,
          currentValuation: form.values.currentValuation,
          valuedAt: form.values.valuedAt,
        });
        notifications.show({
          title: tg("notificationstitle"),
          message: tg("update_has_been_completed"),
          color: "green",
        });
      } else {
        await createMutation.mutateAsync({
          name: form.values.name,
          assetClass: form.values.assetClass,
          currentValuation: form.values.currentValuation,
          valuedAt: form.values.valuedAt,
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
    if (!asset) return;
    modals.openConfirmModal({
      centered: true,
      title: tg("confirmtitle"),
      labels: { confirm: tg("confirm"), cancel: tg("cancel") },
      children: <span>{tg("want_to_delete")}</span>,
      onConfirm: async () => {
        try {
          await removeMutation.mutateAsync(asset.manualAssetId);
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
      createMutation.isPending ||
      updateMutation.isPending ||
      removeMutation.isPending,
    handleSubmit,
    handleRemove,
    handleCancel,
  };
}
