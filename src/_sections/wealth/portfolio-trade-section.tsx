"use client";

import {
  ActionIcon,
  Badge,
  Card,
  Center,
  Drawer,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { queryKeys } from "_constants/queries";
import SubHeader from "_features/layout/components/sub-header";
import TradeForm from "_features/portfolio/components/trade-form";
import {
  usePortfolioItem,
  usePortfolioItemTransactionsInfinite,
} from "_features/portfolio/queries/use-query";
import PortfolioValueTrend from "_sections/wealth/components/portfolio-value-trend";
import { InfiniteSentinel } from "_libraries/query/infinite-sentinel";
import type {
  PortfolioTransactionItemType,
  PortfolioTxType,
} from "_features/portfolio/types";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";
import { fmt } from "_utilities/fmt";

interface Props {
  portfolioId: string;
}

export default function PortfolioTradeSection({ portfolioId }: Props) {
  const t = useTranslations("portfolio");
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const queryClient = useQueryClient();

  const { data: itemData } = usePortfolioItem(portfolioId);
  const portfolio = itemData.body.data;

  const {
    data: txPages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePortfolioItemTransactionsInfinite(portfolioId, 30);

  const trades: PortfolioTransactionItemType[] = useMemo(
    () => (txPages?.pages ?? []).flatMap((p) => p.body.data.items),
    [txPages],
  );

  const [opened, { open, close }] = useDisclosure(false);
  const [initialType, setInitialType] = useState<PortfolioTxType>("BUY");
  const [editingTx, setEditingTx] =
    useState<PortfolioTransactionItemType | null>(null);

  const openTrade = (type: PortfolioTxType) => {
    setEditingTx(null);
    setInitialType(type);
    open();
  };

  const handleEditPortfolio = () => {
    router.push(`/${routeParams.locale}/invest/${portfolio.portfolioId}`);
  };

  const handleCloseModal = () => {
    setEditingTx(null);
    close();
  };

  // 전량 매도면 이 종목은 soft delete 됨 → detail 쿼리 정리(404 refetch 화면깨짐 방지) 후 계좌로 복귀
  const handleTradeSuccess = async (soldOut?: boolean) => {
    if (soldOut) {
      await queryClient.cancelQueries({
        queryKey: queryKeys.portfolio.item(portfolioId).queryKey,
      });
      queryClient.removeQueries({
        queryKey: queryKeys.portfolio.item(portfolioId).queryKey,
      });
      router.replace(
        `/${routeParams.locale}/invest/account/${portfolio.accountId}`,
      );
      return;
    }
    handleCloseModal();
  };

  return (
    <Stack gap="md">
      <SubHeader
        title={portfolio.name}
        right={
          <ActionIcon
            variant="subtle"
            onClick={handleEditPortfolio}
            aria-label="edit"
          >
            <IconPencil size={18} />
          </ActionIcon>
        }
      />

      {/* 종목 hero */}
      <Card radius="xl" p="xl" shadow="md">
        <Stack gap={4}>
          <Text size="xs" fw={500} c="dimmed">
            {t("valuation_amount")}
          </Text>
          <Text
            size="2rem"
            fw={800}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(portfolio.currentValue)}
            <Text span size="lg" c="dimmed" ml={4} fw={600}>
              원
            </Text>
          </Text>
          <Group gap={6}>
            <Text
              size="sm"
              fw={700}
              c={profitColor(portfolio.profitLoss)}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatProfitAmount(portfolio.profitLoss, fmt)}원
            </Text>
            <Text
              size="sm"
              fw={700}
              c={profitColor(portfolio.profitLoss)}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              ({formatProfitRate(portfolio.profitLossRate)})
            </Text>
          </Group>

          <SimpleGrid cols={3} spacing="xs" mt="sm">
            <Stack gap={2}>
              <Text size="10px" c="dimmed" fw={600}>
                {t("holding_qty")}
              </Text>
              <Text
                size="xs"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {portfolio.quantity}
              </Text>
            </Stack>
            <Stack gap={2}>
              <Text size="10px" c="dimmed" fw={600}>
                {t("avg_unit_price")}
              </Text>
              <Text
                size="xs"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(portfolio.avgPrice)}원
              </Text>
            </Stack>
            <Stack gap={2}>
              <Text size="10px" c="dimmed" fw={600}>
                {t("current_price")}
              </Text>
              <Text
                size="xs"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {fmt(portfolio.currentPrice)}원
              </Text>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Card>

      {/* 평가액 추이 차트 */}
      <Suspense
        fallback={
          <Center py="md">
            <Loader size="sm" />
          </Center>
        }
      >
        <PortfolioValueTrend portfolioId={portfolioId} />
      </Suspense>

      {/* 매수/매도 버튼 */}
      <SimpleGrid cols={2} spacing="sm">
        <UnstyledButton
          onClick={() => openTrade("BUY")}
          style={{
            padding: "14px 0",
            borderRadius: 12,
            background: "var(--mantine-color-danger-0)",
            textAlign: "center",
          }}
        >
          <Text size="sm" fw={700} c="danger.5">
            {t("trade_buy")}
          </Text>
        </UnstyledButton>
        <UnstyledButton
          onClick={() => openTrade("SELL")}
          style={{
            padding: "14px 0",
            borderRadius: 12,
            background: "var(--mantine-color-info-0)",
            textAlign: "center",
          }}
        >
          <Text size="sm" fw={700} c="info.5">
            {t("trade_sell")}
          </Text>
        </UnstyledButton>
      </SimpleGrid>

      {/* 거래내역 (매매손익은 계좌 상세로 이동 — 전량매도 시 종목이 사라져도 추적 가능) */}
      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          {t("transactions")}
        </Text>
      </Group>

      {trades.length === 0 ? (
        <Card radius="lg" p="xl">
          <Center>
            <Text size="sm" c="dimmed">
              {t("no_transactions")}
            </Text>
          </Center>
        </Card>
      ) : (
        <>
          <Card radius="lg" p="xs">
            <Stack gap={0}>
              {trades.map((tx) => (
                <UnstyledButton
                  key={tx.txId}
                  onClick={() => {
                    setEditingTx(tx);
                    open();
                  }}
                  style={{ width: "100%" }}
                >
                  <Stack gap={4} style={{ padding: 12, borderRadius: 12 }}>
                    <Group justify="space-between" align="center">
                      <Group gap={6}>
                        <Badge
                          color={tx.ptType === "BUY" ? "danger" : "info"}
                          variant="light"
                          size="sm"
                        >
                          {tx.ptType === "BUY" ? t("trade_buy") : t("trade_sell")}
                        </Badge>
                        <Text size="xs" fw={600} c="dimmed">
                          {tx.txDate}
                        </Text>
                      </Group>
                      <Text
                        size="sm"
                        fw={700}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {fmt(tx.total)}원
                      </Text>
                    </Group>
                    <Group gap={8}>
                      <Text size="11px" c="dimmed">
                        {tx.quantity}주
                      </Text>
                      <Text size="11px" c="dimmed">
                        × {fmt(tx.price)}원
                      </Text>
                    </Group>
                    {tx.memo && (
                      <Text size="11px" c="dimmed">
                        {tx.memo}
                      </Text>
                    )}
                  </Stack>
                </UnstyledButton>
              ))}
            </Stack>
          </Card>

          <InfiniteSentinel
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={fetchNextPage}
          />
        </>
      )}

      {/* 거래 추가 시트(quick-add-sheet) 와 동일 패턴 — 핸들바 + 바텀시트.
          모달 통일 (Image #1 케이스). */}
      <Drawer
        opened={opened}
        onClose={handleCloseModal}
        position="bottom"
        size="auto"
        withCloseButton={false}
        styles={{
          content: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxWidth: 448,
            margin: "0 auto",
            maxHeight: "min(90dvh, calc(100dvh - var(--safe-bottom)))",
          },
          body: {
            paddingBottom: "calc(var(--safe-bottom) + 16px)",
          },
        }}
      >
        <Group justify="center" pt={4} pb={8}>
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: "var(--mantine-color-gray-3)",
            }}
          />
        </Group>

        <Stack gap={4} px="md" pb="xs">
          <Text size="md" fw={800}>
            {editingTx
              ? t("edit_trade")
              : initialType === "BUY"
                ? t("buy_record")
                : t("sell_record")}
          </Text>
        </Stack>

        <TradeForm
          key={editingTx?.txId ?? "new"}
          portfolioId={portfolio.portfolioId}
          initialType={editingTx?.ptType ?? initialType}
          editingTx={editingTx ?? undefined}
          onSuccess={handleTradeSuccess}
          onCancel={handleCloseModal}
        />
      </Drawer>
    </Stack>
  );
}
