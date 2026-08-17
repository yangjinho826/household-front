"use client";

import {
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
import { useTranslations } from "next-intl";
import { useState } from "react";

import FormActions from "_features/common/components/form-actions";
import { useEnumOptions } from "_features/enum/queries/use-query";
import { getErrorMessage } from "_libraries/fetch/error-message";
import { todayIsoKst } from "_utilities/datetime";

import { usePortfolioMutations } from "../queries/use-mutations";

const krw = (n: number) => new Intl.NumberFormat("ko-KR").format(Math.round(n));
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
  /** 종목의 거래통화. USD 면 입력 단위가 달러가 되고 원화 환산을 같이 보여준다 */
  currency?: string;
  /** 현재 환율(1 통화당 원). 종목의 currentPrice / currentPriceCcy 로 구해서 넘긴다 */
  fxRate?: number | null;
}

interface FormValues {
  tradeType: PortfolioTxType;
  quantity: number;
  price: number;
  fee: number;
  txDate: string;
  memo: string;
}

export default function TradeForm({
  portfolioId,
  initialType = "BUY",
  editingTx,
  onSuccess,
  onCancel,
  currency = "KRW",
  fxRate = null,
}: TradeFormProps) {
  const te = useTranslations("error");
  const tg = useTranslations("general");
  const t = useTranslations("portfolio");
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

  // 수정 모드의 입력 단위는 **그 거래가 기록된 방식**을 따른다 — 백엔드 update 도
  // 같은 필드(price_ccy)로 판정하므로 양쪽이 어긋나지 않는다. 원본 달러가가 없는
  // 과거 거래는 달러 칸에 원화를 넣게 되므로 원화로 편집한다.
  const editsInCcy =
    !!editingTx && editingTx.currency !== "KRW" && editingTx.priceCcy !== null;
  const inputCurrency = editingTx ? (editsInCcy ? editingTx.currency : "KRW") : currency;
  // 과거 거래는 그때 박제된 환율로 환산을 보여줘야 저장 결과와 일치한다.
  const inputFxRate = editingTx ? (editsInCcy ? editingTx.fxRate : null) : fxRate;

  const form = useForm<FormValues>({
    initialValues: {
      tradeType: editingTx?.ptType ?? initialType,
      quantity: editingTx?.quantity ?? 0,
      price: (editsInCcy ? editingTx?.priceCcy : editingTx?.price) ?? 0,
      fee: (editsInCcy ? editingTx?.feeCcy : editingTx?.fee) ?? 0,
      txDate: editingTx?.txDate ?? todayIsoKst(),
      memo: editingTx?.memo ?? "",
    },
    validate: {
      quantity: (v) => (v > 0 ? null : t("quantity_required")),
      price: (v) => (v > 0 ? null : t("price_required")),
      fee: (v) => (v >= 0 ? null : t("fee_negative")),
      txDate: (v) => (v ? null : t("tx_date_required")),
    },
  });

  const handleSubmit = async (raw: FormValues) => {
    setSubmitting(true);
    let soldOut = false;
    // NumberInput 이 문자열을 흘려보낼 수 있어 요청 직전에 숫자로 고정한다.
    const values: FormValues = {
      ...raw,
      quantity: Number(raw.quantity) || 0,
      price: Number(raw.price) || 0,
      fee: Number(raw.fee) || 0,
    };
    try {
      if (editingTx) {
        await updateTxMutation.mutateAsync({
          txId: editingTx.txId,
          quantity: values.quantity,
          price: values.price,
          fee: values.fee,
          txDate: values.txDate,
          memo: values.memo.trim() || null,
        });
        notifications.show({
          title: t("edit_done_title"),
          message: t("edit_done_msg"),
          color: editingTx.ptType === "BUY" ? "red" : "blue",
        });
      } else if (values.tradeType === "BUY") {
        await buyMutation.mutateAsync({
          portfolioId,
          quantity: values.quantity,
          price: values.price,
          fee: values.fee,
          txDate: values.txDate,
          memo: values.memo.trim() || null,
        });
        notifications.show({
          title: t("buy_done_title"),
          message: t("buy_done_msg"),
          color: "red",
        });
      } else {
        // 전량 매도 시 백엔드가 종목을 soft delete 하고 data=null 반환 → soldOut 신호
        const res = await sellMutation.mutateAsync({
          portfolioId,
          quantity: values.quantity,
          sellPrice: values.price,
          fee: values.fee,
          txDate: values.txDate,
          memo: values.memo.trim() || null,
        });
        soldOut = res.body.data === null;
        notifications.show({
          title: t("sell_done_title"),
          message: soldOut
            ? t("sell_done_soldout_msg")
            : t("sell_done_msg"),
          color: "blue",
        });
      }
      onSuccess?.(soldOut);
    } catch (error) {
      notifications.show({
        title: isEdit ? t("edit_fail_title") : t("record_fail_title"),
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
      title: t("delete_title"),
      labels: { confirm: tg("common.delete"), cancel: tg("common.cancel") },
      confirmProps: { color: "red" },
      children: (
        <span>
          {t("delete_confirm_msg")}
          <br />
          {t("delete_recalc_msg")}
        </span>
      ),
      onConfirm: async () => {
        setSubmitting(true);
        try {
          await removeTxMutation.mutateAsync(editingTx.txId);
          notifications.show({
            title: t("delete_done_title"),
            message: t("delete_done_msg"),
            color: "green",
          });
          onSuccess?.();
        } catch (error) {
          notifications.show({
            title: t("delete_fail_title"),
            message: getErrorMessage(error, te),
            color: "red",
          });
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  // Mantine NumberInput 은 편집 중 값을 문자열("0500")로 준다. 곱셈은 숫자로
  // 강제되지만 덧셈은 문자열 연결이 되므로("10000"+"500"→"10000500") 반드시 Number 로 캐스팅한다.
  const num = (v: number | string) => Number(v) || 0;
  const total = num(form.values.quantity) * num(form.values.price);
  const fee = num(form.values.fee);
  const isBuy = form.values.tradeType === "BUY";
  // 정산금액 — 매수는 수수료만큼 더 나가고, 매도는 그만큼 덜 들어온다.
  const settlement = isBuy ? total + fee : total - fee;
  // 달러 입력이면 금액을 달러로 표기하고 원화 환산을 보조로 붙인다.
  // 환율을 모르면(과거 데이터) 환산을 생략한다 — 추정치를 돈처럼 보여주지 않는다.
  const isForeign = inputCurrency !== "KRW";
  const unit = isForeign ? "$" : tg("won");
  const toKrw = (v: number) => (inputFxRate ? v * inputFxRate : null);
  const amountText = (v: number) =>
    isForeign ? `$${v.toFixed(2)}` : `${krw(v)} ${tg("won")}`;
  const krwSub = (v: number) => {
    if (!isForeign) return null;
    const won = toKrw(v);
    return won === null ? null : `${krw(won)} ${tg("won")}`;
  };
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
          label={t("quantity")}
          placeholder="0"
          min={0}
          decimalScale={4}
          thousandSeparator=","
        />
        <NumberInput
          {...form.getInputProps("price")}
          label={isBuy ? t("label_buy_price") : t("label_sell_price")}
          placeholder="0"
          min={0}
          thousandSeparator=","
          rightSection={
            <span style={{ fontSize: 11, color: "var(--mantine-color-gray-6)" }}>{unit}</span>
          }
        />
        <NumberInput
          {...form.getInputProps("fee")}
          label={t("label_fee")}
          description={isBuy ? t("fee_buy_hint") : t("fee_sell_hint")}
          placeholder="0"
          min={0}
          thousandSeparator=","
          rightSection={
            <span style={{ fontSize: 11, color: "var(--mantine-color-gray-6)" }}>{unit}</span>
          }
        />
        <DateInput
          value={form.values.txDate || null}
          onChange={(value) => form.setFieldValue("txDate", value ?? "")}
          error={form.errors.txDate}
          label={t("label_tx_date")}
          placeholder="YYYY-MM-DD"
          valueFormat="YYYY-MM-DD"
        />
        <Textarea
          {...form.getInputProps("memo")}
          label={t("label_memo")}
          placeholder={t("memo_placeholder")}
          autosize
          minRows={1}
        />

        {/* 거래금액 / 수수료 / 정산금액 — 증권사 거래내역과 같은 3줄.
            정산금액이 실제로 계좌를 드나드는 돈이라 굵게 강조한다. */}
        <Stack gap={4} px={4}>
          <SummaryRow
            label={isBuy ? t("buy_amount") : t("sell_amount")}
            value={amountText(total)}
            sub={krwSub(total)}
          />
          <SummaryRow
            label={t("label_fee")}
            value={`${isBuy ? "+" : "−"}${amountText(fee)}`}
            sub={krwSub(fee)}
          />
          <SummaryRow
            label={t("settlement_amount")}
            value={amountText(settlement)}
            sub={krwSub(settlement)}
            strong
          />
        </Stack>

        {/* 거래 추가 시트(transaction/form.tsx) 와 동일 패턴 — 취소 + 액션 2버튼.
            매수/매도 색상은 유지 (UX 핵심). */}
        <FormActions
          submitLabel={
            isEdit ? t("edit_trade") : isBuy ? t("buy_record") : t("sell_record")
          }
          submitColor={isBuy ? "danger" : "info"}
          isPending={isPending}
          onCancel={onCancel}
          cancelLabel={tg("common.cancel")}
          onRemove={isEdit ? handleRemove : undefined}
          removeLabel={tg("common.delete")}
          sticky
        />
      </Stack>
    </form>
  );
}

/** 요약 한 줄 — 달러 종목이면 아래에 원화 환산을 작게 붙인다. */
function SummaryRow({
  label,
  value,
  sub,
  strong = false,
}: {
  label: string;
  value: string;
  sub: string | null;
  strong?: boolean;
}) {
  return (
    <Group justify="space-between" align="flex-start">
      <span style={{ fontSize: 12, color: "var(--mantine-color-gray-6)" }}>
        {label}
      </span>
      <Stack gap={0} align="flex-end">
        <span
          style={{
            fontSize: strong ? 15 : 13,
            fontWeight: strong ? 800 : 400,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        {sub && (
          <span
            style={{
              fontSize: 11,
              color: "var(--mantine-color-gray-6)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {sub}
          </span>
        )}
      </Stack>
    </Group>
  );
}
