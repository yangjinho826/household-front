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
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { getErrorMessage } from "_libraries/fetch/error-message";
import { todayIsoKst } from "_utilities/datetime";

import { usePortfolioMutations } from "../queries/use-mutations";

type TradeType = "BUY" | "SELL";

interface TradeFormProps {
  /** 종목 ID (필수 — 매수/매도 모두 기존 종목에 대해 수행) */
  portfolioId: string;
  initialType?: TradeType;
  onSuccess?: () => void;
}

interface FormValues {
  tradeType: TradeType;
  quantity: number;
  price: number;
  txDate: string;
  memo: string;
}

export default function TradeForm({
  portfolioId,
  initialType = "BUY",
  onSuccess,
}: TradeFormProps) {
  const te = useTranslations("error");
  const { buyMutation, sellMutation } = usePortfolioMutations();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      tradeType: initialType,
      quantity: 0,
      price: 0,
      txDate: todayIsoKst(),
      memo: "",
    },
    validate: {
      quantity: (v) => (v > 0 ? null : "수량을 입력해주세요"),
      price: (v) => (v > 0 ? null : "단가를 입력해주세요"),
      txDate: (v) => (v ? null : "거래일을 입력해주세요"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      if (values.tradeType === "BUY") {
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
        await sellMutation.mutateAsync({
          portfolioId,
          quantity: values.quantity,
          sellPrice: values.price,
          txDate: values.txDate,
          memo: values.memo.trim() || null,
        });
        notifications.show({
          title: "매도 기록 완료",
          message: "매도 거래가 추가되었습니다.",
          color: "blue",
        });
      }
      onSuccess?.();
    } catch (error) {
      notifications.show({
        title: "거래 기록 실패",
        message: getErrorMessage(error, te),
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const total = (form.values.quantity || 0) * (form.values.price || 0);
  const isBuy = form.values.tradeType === "BUY";

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="sm">
        <SegmentedControl
          {...form.getInputProps("tradeType")}
          fullWidth
          data={[
            { value: "BUY", label: "매수" },
            { value: "SELL", label: "매도" },
          ]}
          color={isBuy ? "tossRed" : "tossBlue"}
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
            <span style={{ fontSize: 11, color: "#8B95A1" }}>원</span>
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
          <span style={{ fontSize: 12, color: "#8B95A1" }}>
            {isBuy ? "매수금액" : "매도금액"}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            {new Intl.NumberFormat("ko-KR").format(Math.round(total))} 원
          </span>
        </Group>

        <Button
          type="submit"
          loading={submitting || buyMutation.isPending || sellMutation.isPending}
          color={isBuy ? "tossRed" : "tossBlue"}
          size="md"
        >
          {isBuy ? "매수 기록" : "매도 기록"}
        </Button>
      </Stack>
    </form>
  );
}
