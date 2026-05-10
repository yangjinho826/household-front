"use client";

import {
  ActionIcon,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { queryKeys } from "_constants/queries";
import { parseKstDate } from "_utilities/datetime";
import { todayIso } from "_utilities/fmt";

import TxRow from "./tx-row";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 월별 달력 뷰 — 백엔드 calendar API (일별 합계) + list API (선택일 거래).
 */
export default function TransactionCalendarView() {
  const today = todayIso(); // YYYY-MM-DD (KST)
  const [year, setYear] = useState(() => parseKstDate(today).year());
  const [month, setMonth] = useState(() => parseKstDate(today).month() + 1);
  const [selectedDate, setSelectedDate] = useState<string>(today);

  // 일별 합계 (백엔드 미리 계산)
  const { data: calData } = useSuspenseQuery(
    queryKeys.transaction.calendar({ year, month }),
  );
  const calendar = calData.body.data;

  // 선택일 거래 — 그달 list (백엔드 year/month 필터 + 큰 limit)
  const { data: txData } = useSuspenseQuery(
    queryKeys.transaction.list({ year, month, listSize: 500 }),
  );
  const monthItems = txData.body.data.content;

  const dayStats = useMemo(() => {
    const map = new Map<
      string,
      { income: number; expense: number; transfer: number; count: number }
    >();
    for (const d of calendar.days) {
      map.set(d.date, {
        income: d.income,
        expense: d.expense,
        transfer: d.transfer,
        count: d.count,
      });
    }
    return map;
  }, [calendar.days]);

  // 달력 cell 배열 (앞 빈칸 + 1~daysInMonth + 뒷 빈칸)
  const cells = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const arr: (number | null)[] = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, month]);

  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
  const selectedTx = monthItems.filter(
    (it) => it.txDate.slice(0, 10) === selectedDate,
  );

  const prev = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const next = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <Stack gap="md">
      {/* 월간 합계 */}
      <Card radius="lg" p="md">
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <ActionIcon variant="subtle" onClick={prev} aria-label="prev">
              <IconChevronLeft size={16} />
            </ActionIcon>
            <Text fw={700}>
              {year}년 {month}월
            </Text>
            <ActionIcon variant="subtle" onClick={next} aria-label="next">
              <IconChevronRight size={16} />
            </ActionIcon>
          </Group>

          <SimpleGrid cols={3} spacing="xs">
            <Stack gap={2} align="center">
              <Text size="10px" c="dimmed" fw={600}>
                수입
              </Text>
              <Text size="xs" fw={700} c="tossGreen.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                +{calendar.monthlyIncome.toLocaleString("ko-KR")}
              </Text>
            </Stack>
            <Stack gap={2} align="center">
              <Text size="10px" c="dimmed" fw={600}>
                지출
              </Text>
              <Text size="xs" fw={700} c="tossRed.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                -{calendar.monthlyExpense.toLocaleString("ko-KR")}
              </Text>
            </Stack>
            <Stack gap={2} align="center">
              <Text size="10px" c="dimmed" fw={600}>
                이체
              </Text>
              <Text size="xs" fw={700} c="tossPurple.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                {calendar.monthlyTransfer.toLocaleString("ko-KR")}
              </Text>
            </Stack>
          </SimpleGrid>

          <SimpleGrid cols={7} spacing={4}>
            {DAY_LABELS.map((d, i) => (
              <Text
                key={d}
                size="10px"
                fw={700}
                ta="center"
                c={i === 0 ? "tossRed.5" : i === 6 ? "tossBlue.5" : "dimmed"}
                py={4}
              >
                {d}
              </Text>
            ))}
            {cells.map((day, idx) => {
              if (day === null) return <div key={`pad-${idx}`} />;
              const date = `${monthPrefix}-${String(day).padStart(2, "0")}`;
              const stat = dayStats.get(date);
              const isSelected = selectedDate === date;
              const isToday = date === today;
              const dow = idx % 7;
              const dayColor =
                dow === 0
                  ? "var(--mantine-color-tossRed-5)"
                  : dow === 6
                    ? "var(--mantine-color-tossBlue-5)"
                    : "var(--mantine-color-gray-9)";
              return (
                <UnstyledButton
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  style={{
                    aspectRatio: "1 / 1",
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    background: isSelected
                      ? "var(--mantine-color-tossBlue-5)"
                      : isToday
                        ? "var(--mantine-color-tossBlue-0)"
                        : "transparent",
                  }}
                >
                  <Text
                    size="xs"
                    fw={700}
                    style={{ color: isSelected ? "white" : dayColor }}
                  >
                    {day}
                  </Text>
                  {stat && (
                    <Stack gap={0} align="center">
                      {stat.income > 0 && (
                        <Text
                          size="8px"
                          fw={700}
                          c={isSelected ? "white" : "tossGreen.5"}
                        >
                          +{Math.round(stat.income / 10000)}만
                        </Text>
                      )}
                      {stat.expense > 0 && (
                        <Text
                          size="8px"
                          fw={700}
                          c={isSelected ? "white" : "tossRed.5"}
                        >
                          -{Math.round(stat.expense / 10000)}만
                        </Text>
                      )}
                    </Stack>
                  )}
                </UnstyledButton>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Card>

      <Stack gap="xs">
        <Text size="sm" fw={700} px={4}>
          {selectedDate.slice(5).replace("-", "월 ")}일 거래
        </Text>
        <Card radius="lg" p="xs">
          {selectedTx.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="lg">
              거래가 없습니다
            </Text>
          ) : (
            <Stack gap={0}>
              {selectedTx.map((tx) => (
                <TxRow key={tx.transactionId} t={tx} />
              ))}
            </Stack>
          )}
        </Card>
      </Stack>
    </Stack>
  );
}
