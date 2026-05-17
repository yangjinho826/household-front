"use client";

import {
  ActionIcon,
  Badge,
  Card,
  Center,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowLeft, IconPencil } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

import TradeForm from "_features/portfolio/components/trade-form";
import type {
  PortfolioTransactionItemType,
  PortfolioTxType,
} from "_features/portfolio/types";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";
import { queryKeys } from "_constants/queries";
import { fmt } from "_utilities/fmt";

interface Props {
  portfolioId: string;
}

export default function PortfolioTradeSection({ portfolioId }: Props) {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();

  const { data: portfolioData } = useSuspenseQuery(
    queryKeys.portfolio.list({}),
  );
  const portfolio = portfolioData.body.data.content.find(
    (p) => p.portfolioId === portfolioId,
  );

  const { data: txData } = useSuspenseQuery(
    queryKeys.portfolio.transactions({ accountId: portfolio?.accountId }),
  );
  // 종목 단위 필터 (백엔드는 accountId 만 지원) — (country, code) 로 식별
  const trades = txData.body.data.content.filter(
    (t) => t.country === portfolio?.country && t.code === portfolio?.code,
  );

  const [opened, { open, close }] = useDisclosure(false);
  const [initialType, setInitialType] = useState<PortfolioTxType>("BUY");
  const [editingTx, setEditingTx] =
    useState<PortfolioTransactionItemType | null>(null);

  if (!portfolio) {
    return (
      <Stack gap="md">
        <Text c="dimmed">종목을 찾을 수 없습니다.</Text>
      </Stack>
    );
  }

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
      <Group justify="space-between" align="center">
        <Group gap={4} align="center">
          <ActionIcon
            variant="subtle"
            onClick={() => router.back()}
            aria-label="back"
          >
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Title order={3}>{portfolio.name}</Title>
        </Group>
        <ActionIcon
          variant="subtle"
          onClick={handleEditPortfolio}
          aria-label="edit"
        >
          <IconPencil size={18} />
        </ActionIcon>
      </Group>

      {/* 종목 hero */}
      <Card radius="xl" p="lg">
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
            background: "var(--mantine-color-tossRed-0)",
            textAlign: "center",
          }}
        >
          <Text size="sm" fw={700} c="tossRed.5">
            매수
          </Text>
        </UnstyledButton>
        <UnstyledButton
          onClick={() => openTrade("SELL")}
          style={{
            padding: "14px 0",
            borderRadius: 12,
            background: "var(--mantine-color-tossBlue-0)",
            textAlign: "center",
          }}
        >
          <Text size="sm" fw={700} c="tossBlue.5">
            매도
          </Text>
        </UnstyledButton>
      </SimpleGrid>

      {/* 거래 내역 */}
      <Group justify="space-between" align="center" px={4}>
        <Text size="sm" fw={700}>
          거래 내역 ({trades.length})
        </Text>
      </Group>

      {trades.length === 0 ? (
        <Card radius="lg" p="xl">
          <Center>
            <Text size="sm" c="dimmed">
              거래 내역이 없습니다
            </Text>
          </Center>
        </Card>
      ) : (
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
                        color={t.ptType === "BUY" ? "tossRed" : "tossBlue"}
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
      )}

      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={
          editingTx
            ? "거래 수정"
            : initialType === "BUY"
              ? "매수 기록"
              : "매도 기록"
        }
        centered
        size="md"
      >
        <TradeForm
          key={editingTx?.txId ?? "new"}
          portfolioId={portfolio.portfolioId}
          initialType={editingTx?.ptType ?? initialType}
          editingTx={editingTx ?? undefined}
          onSuccess={handleCloseModal}
        />
      </Modal>
    </Stack>
  );
}
