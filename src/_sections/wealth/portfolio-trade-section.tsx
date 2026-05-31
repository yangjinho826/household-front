"use client";

import {
  ActionIcon,
  Badge,
  Card,
  Center,
  Drawer,
  Group,
  Loader,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import SubHeader from "_features/layout/components/sub-header";
import TradeForm from "_features/portfolio/components/trade-form";
import {
  usePortfolioItem,
  usePortfolioItemTransactionsInfinite,
} from "_features/portfolio/queries/use-query";
import RealizedPnlPanel from "_sections/wealth/components/realized-pnl-panel";
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
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

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
  const [tab, setTab] = useState<"history" | "realized">("history");

  const openTrade = (type: PortfolioTxType) => {
    setEditingTx(null);
    setInitialType(type);
    open();
  };

  const handleEditPortfolio = () => {
    router.push(`/${routeParams.locale}/portfolio/${portfolio.portfolioId}`);
  };

  const handleCloseModal = () => {
    setEditingTx(null);
    close();
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
            평가금액
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
                보유수량
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
                평균단가
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
                현재가
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
            매수
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
            매도
          </Text>
        </UnstyledButton>
      </SimpleGrid>

      {/* 거래내역 / 매매손익 탭 */}
      <SegmentedControl
        fullWidth
        value={tab}
        onChange={(v) => setTab(v as "history" | "realized")}
        data={[
          { value: "history", label: "거래내역" },
          { value: "realized", label: "매매손익" },
        ]}
      />

      {tab === "realized" && (
        <Suspense
          fallback={
            <Center py="xl">
              <Loader size="sm" />
            </Center>
          }
        >
          <RealizedPnlPanel portfolioId={portfolioId} />
        </Suspense>
      )}

      {tab === "history" &&
        (trades.length === 0 ? (
        <Card radius="lg" p="xl">
          <Center>
            <Text size="sm" c="dimmed">
              거래 내역이 없습니다
            </Text>
          </Center>
        </Card>
      ) : (
        <>
          <Card radius="lg" p="xs">
            <Stack gap={0}>
              {trades.map((t) => (
                <UnstyledButton
                  key={t.txId}
                  onClick={() => {
                    setEditingTx(t);
                    open();
                  }}
                  style={{ width: "100%" }}
                >
                  <Stack gap={4} style={{ padding: 12, borderRadius: 12 }}>
                    <Group justify="space-between" align="center">
                      <Group gap={6}>
                        <Badge
                          color={t.ptType === "BUY" ? "danger" : "info"}
                          variant="light"
                          size="sm"
                        >
                          {t.ptType === "BUY" ? "매수" : "매도"}
                        </Badge>
                        <Text size="xs" fw={600} c="dimmed">
                          {t.txDate}
                        </Text>
                      </Group>
                      <Text
                        size="sm"
                        fw={700}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {fmt(t.total)}원
                      </Text>
                    </Group>
                    <Group gap={8}>
                      <Text size="11px" c="dimmed">
                        {t.quantity}주
                      </Text>
                      <Text size="11px" c="dimmed">
                        × {fmt(t.price)}원
                      </Text>
                    </Group>
                    {t.memo && (
                      <Text size="11px" c="dimmed">
                        {t.memo}
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
      ))}

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
              ? "거래 수정"
              : initialType === "BUY"
                ? "매수 기록"
                : "매도 기록"}
          </Text>
        </Stack>

        <TradeForm
          key={editingTx?.txId ?? "new"}
          portfolioId={portfolio.portfolioId}
          initialType={editingTx?.ptType ?? initialType}
          editingTx={editingTx ?? undefined}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Drawer>
    </Stack>
  );
}
