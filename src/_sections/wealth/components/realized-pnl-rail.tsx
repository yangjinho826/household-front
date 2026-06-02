"use client";

import { Card, Drawer, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useState } from "react";

import RealizedPnlPanel from "_sections/wealth/components/realized-pnl-panel";
import { useAccountRealizedPnl } from "_features/portfolio/queries/use-query";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";
import { fmt } from "_utilities/fmt";

interface Props {
  accountId: string;
}

/**
 * 누적 매매수익 레일 — 종목비중 도넛 아래 얇은 카드.
 * "도넛=지금 보유 / 레일=팔고 지나간 성과" 대비. 대표값은 최근 1년,
 * 탭하면 바텀시트에서 날짜(년/월/일)를 자유롭게 선택해 매도내역을 본다.
 * 전량매도로 사라진 종목 성과까지 집계됨. 최근 1년 매도 없으면 레일 숨김.
 */
export default function RealizedPnlRail({ accountId }: Props) {
  const t = useTranslations("portfolio");
  const [opened, { open, close }] = useDisclosure(false);
  // 레일 대표 = 최근 1년. 시트에 같은 기본 범위를 넘겨 일관(거기서 자유 변경).
  const [range] = useState(() => {
    const to = new Date();
    return { from: dayjs(to).subtract(1, "year").toDate(), to };
  });
  const { data } = useAccountRealizedPnl(
    accountId,
    dayjs(range.from).format("YYYY-MM-DD"),
    dayjs(range.to).format("YYYY-MM-DD"),
  );
  const { summary, rows } = data.body.data;

  if (rows.length === 0) return null;

  return (
    <>
      <UnstyledButton onClick={open} style={{ width: "100%" }}>
        <Card radius="xl" p="md">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Stack gap={2} style={{ minWidth: 0 }}>
              <Group gap={6}>
                <Text size="xs" fw={600} c="dimmed">
                  {t("cumulative_realized")}
                </Text>
                <Text size="10px" c="dimmed">
                  · {t("realized_recent_1y")}
                </Text>
              </Group>
              <Group gap={6} wrap="nowrap">
                <Text
                  size="md"
                  fw={800}
                  c={profitColor(summary.totalRealized)}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatProfitAmount(summary.totalRealized, fmt)}원
                </Text>
                <Text
                  size="xs"
                  fw={700}
                  c={profitColor(summary.totalRate)}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatProfitRate(summary.totalRate)}
                </Text>
                <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
                  · {t("sell_count", { count: rows.length })}
                </Text>
              </Group>
            </Stack>
            <IconChevronRight size={16} color="var(--mantine-color-gray-5)" />
          </Group>
        </Card>
      </UnstyledButton>

      <Drawer
        opened={opened}
        onClose={close}
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
        <Stack gap="sm" px="md">
          <Text size="md" fw={800}>
            {t("cumulative_realized")}
          </Text>
          <RealizedPnlPanel
            accountId={accountId}
            initialFrom={range.from}
            initialTo={range.to}
          />
        </Stack>
      </Drawer>
    </>
  );
}
