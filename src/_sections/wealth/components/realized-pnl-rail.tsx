"use client";

import { Card, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import FormSheet from "_features/common/components/form-sheet";
import RealizedPnlPanel from "_sections/wealth/components/realized-pnl-panel";
import { useMoney } from "_features/common/hooks/use-money";
import { useAccountRealizedPnl } from "_features/portfolio/queries/use-query";
import {
  formatProfitAmount,
  formatProfitRate,
  profitColor,
} from "_features/portfolio/utils";

interface Props {
  accountId: string;
}

/**
 * 누적 매매수익 레일 — 종목비중 도넛 아래 얇은 카드.
 * "도넛=지금 보유 / 레일=팔고 지나간 성과" 대비. 대표값은 전체 매도기간(백엔드가
 * 첫 매도일~오늘로 잡음), 탭하면 바텀시트에서 날짜를 자유롭게 좁혀 매도내역을 본다.
 * 전량매도로 사라진 종목 성과까지 집계됨. 매도 이력 없으면 레일 숨김.
 */
export default function RealizedPnlRail({ accountId }: Props) {
  const t = useTranslations("portfolio");
  const money = useMoney();
  const [opened, { open, close }] = useDisclosure(false);
  // from/to 미전송 → 백엔드가 첫 매도일~오늘 전체로 집계. 시트도 동일 기본 범위.
  const { data } = useAccountRealizedPnl(accountId);
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
                  · {t("realized_all_period")}
                </Text>
              </Group>
              <Group gap={6} wrap="nowrap">
                <Text
                  size="md"
                  fw={800}
                  c={profitColor(summary.totalRealized)}
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatProfitAmount(summary.totalRealized, money)}
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

      <FormSheet
        opened={opened}
        onClose={close}
        title={t("cumulative_realized")}
      >
        <RealizedPnlPanel accountId={accountId} />
      </FormSheet>
    </>
  );
}
