"use client";

import {
  Button,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useEnumOptions } from "_features/enum/queries/use-query";
import { getErrorMessage } from "_libraries/fetch/error-message";
import { todayIsoKst } from "_utilities/datetime";

import { usePortfolioMutations } from "../queries/use-mutations";
import type {
  PortfolioTransactionItemType,
  PortfolioTxType,
} from "../types";

interface TradeFormProps {
  /** 종목 ID (필수 — 매수/매도 모두 기존 종목에 대해 수행) */
  portfolioId: string;
  initialType?: PortfolioTxType;
  /** 있으면 수정 모드 — initialValues 채움 + tradeType 잠금 + 삭제 버튼 노출 */
  editingTx?: PortfolioTransactionItemType;
  /** soldOut=true → 전량 매도로 종목이 사라짐 (호출 측이 화면 이탈 처리) */
  onSuccess?: (soldOut?: boolean) => void;
  /** 시트/모달에서 사용할 때 — 취소 버튼 노출 + 닫기 콜백 */
  onCancel?: () => void;
}

interface FormValues {
  tradeType: PortfolioTxType;
  quantity: number;
  price: number;
  txDate: string;
  memo: string;
}

export default function TradeForm({
  portfolioId,
  initialType = "BUY",
  editingTx,
  onSuccess,
  onCancel,
}: TradeFormProps) {
  const te = useTranslations("error");
  const tg = useTranslations("general");
  const tPt = useTranslations("enum.portfolio-tx-type");
  const { data: ptTypeData } = useEnumOptions("portfolio-tx-type");
  const {
    buyMutation,
    sellMutation,
    updateTxMutation,
    removeTxMutation,
  } = usePortfolioMutations();
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!editingTx;

  const form = useForm<FormValues>({
    initialValues: {
      tradeType: editingTx?.ptType ?? initialType,
      quantity: editingTx?.quantity ?? 0,
      price: editingTx?.price ?? 0,
      txDate: editingTx?.txDate ?? todayIsoKst(),
      memo: editingTx?.memo ?? "",
    },
    validate: {
      quantity: (v) => (v > 0 ? null : "수량을 입력해주세요"),
      price: (v) => (v > 0 ? null : "단가를 입력해주세요"),
      txDate: (v) => (v ? null : "거래일을 입력해주세요"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    let soldOut = false;
    try {
      if (editingTx) {
        await updateTxMutation.mutateAsync({
          txId: editingTx.txId,
          quantity: values.quantity,
          price: values.price,
          txDate: values.txDate,
          memo: values.memo.trim() || null,
        });
        notifications.show({
          title: "거래 수정 완료",
          message: "거래가 수정되었습니다.",
          color: editingTx.ptType === "BUY" ? "red" : "blue",
        });
      } else if (values.tradeType === "BUY") {
        await buyMutation.mutateAsync({
          portfolioId,
          quantity: values.quantity,
          price: values.price,
          txDate: values.txDate,
          memo: values.memo.trim() || null,
        });
        notifications.show({
          title: "매수 기록 완료",
          message: "매수 거래가 추가되었습니다.",
          color: "red",
        });
      } else {
        // 전량 매도 시 백엔드가 종목을 soft delete 하고 data=null 반환 → soldOut 신호
        const res = await sellMutation.mutateAsync({
          portfolioId,
          quantity: values.quantity,
          sellPrice: values.price,
          txDate: values.txDate,
          memo: values.memo.trim() || null,
        });
        soldOut = res.body.data === null;
        notifications.show({
          title: "매도 기록 완료",
          message: soldOut
            ? "전량 매도되어 보유 종목에서 제외됐어요."
            : "매도 거래가 추가되었습니다.",
          color: "blue",
        });
      }
      onSuccess?.(soldOut);
    } catch (error) {
      notifications.show({
        title: isEdit ? "거래 수정 실패" : "거래 기록 실패",
        message: getErrorMessage(error, te),
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = () => {
    if (!editingTx) return;
    modals.openConfirmModal({
      centered: true,
      title: "거래 삭제",
      labels: { confirm: "삭제", cancel: "취소" },
      confirmProps: { color: "red" },
      children: (
        <span>
          이 거래를 삭제할까요?
          <br />
          종목의 보유 수량과 평균가가 재계산됩니다.
        </span>
      ),
      onConfirm: async () => {
        setSubmitting(true);
        try {
          await removeTxMutation.mutateAsync(editingTx.txId);
          notifications.show({
            title: "거래 삭제 완료",
            message: "거래가 삭제되었습니다.",
            color: "green",
          });
          onSuccess?.();
        } catch (error) {
          notifications.show({
            title: "거래 삭제 실패",
            message: getErrorMessage(error, te),
            color: "red",
          });
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  const total = (form.values.quantity || 0) * (form.values.price || 0);
  const isBuy = form.values.tradeType === "BUY";
  const isPending =
    submitting ||
    buyMutation.isPending ||
    sellMutation.isPending ||
    updateTxMutation.isPending ||
    removeTxMutation.isPending;

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <SegmentedControl
          {...form.getInputProps("tradeType")}
          fullWidth
          data={ptTypeData.body.data.map((v) => ({
            value: v,
            label: tPt(v),
          }))}
          color={isBuy ? "danger" : "info"}
          disabled={isEdit}
        />
        <NumberInput
          {...form.getInputProps("quantity")}
          label="수량"
          placeholder="0"
          min={0}
          decimalScale={4}
          thousandSeparator=","
        />
        <NumberInput
          {...form.getInputProps("price")}
          label={isBuy ? "매수가" : "매도가"}
          placeholder="0"
          min={0}
          thousandSeparator=","
          rightSection={
            <span style={{ fontSize: 11, color: "var(--mantine-color-gray-6)" }}>{tg("won")}</span>
          }
        />
        <DateInput
          value={
            form.values.txDate ? dayjs(form.values.txDate).toDate() : null
          }
          onChange={(d) =>
            form.setFieldValue(
              "txDate",
              d ? dayjs(d).format("YYYY-MM-DD") : "",
            )
          }
          error={form.errors.txDate}
          label="거래일"
          placeholder="YYYY-MM-DD"
          valueFormat="YYYY-MM-DD"
        />
        <Textarea
          {...form.getInputProps("memo")}
          label="메모"
          placeholder="(선택)"
          autosize
          minRows={1}
        />

        <Group justify="space-between" px={4}>
          <span style={{ fontSize: 12, color: "var(--mantine-color-gray-6)" }}>
            {isBuy ? "매수금액" : "매도금액"}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            {new Intl.NumberFormat("ko-KR").format(Math.round(total))} 원
          </span>
        </Group>

        {/* 거래 추가 시트(transaction/form.tsx) 와 동일 패턴 — 취소 + 액션 2버튼.
            매수/매도 색상은 유지 (UX 핵심). */}
        <Group grow mt="md">
          {onCancel && (
            <Button
              type="button"
              variant="light"
              onClick={onCancel}
              disabled={isPending}
            >
              취소
            </Button>
          )}
          <Button
            type="submit"
            loading={isPending}
            color={isBuy ? "danger" : "info"}
          >
            {isEdit ? "거래 수정" : isBuy ? "매수 기록" : "매도 기록"}
          </Button>
        </Group>

        {isEdit && (
          <Button
            type="button"
            variant="light"
            color="red"
            onClick={handleRemove}
            disabled={isPending}
            fullWidth
          >
            삭제
          </Button>
        )}
      </Stack>
    </form>
  );
}
