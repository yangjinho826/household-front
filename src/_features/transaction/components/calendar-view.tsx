"use client";

import { Card, Grid, SimpleGrid, Stack, Text, UnstyledButton } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { TOKEN } from "_styles/design-tokens";
import { queryKeys } from "_constants/queries";
import { todayIso } from "_utilities/fmt";

import TxRow from "./tx-row";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
// 선택일 = 진한 세이지(흰 텍스트 대비), 오늘 = 연한 세이지 배경
const SELECTED_BG = TOKEN.sageAction;
const TODAY_BG = "#EEF1EA";

interface CalendarViewProps {
  year: number;
  month: number;
}

/**
 * 월별 달력 뷰 — 백엔드 calendar API (일별 합계) + list API (선택일 거래).
 *
 * 월 선택은 부모(transactions-section) 의 MonthPicker 에서 관리.
 */
export default function TransactionCalendarView({ year, month }: CalendarViewProps) {
  const today = todayIso(); // YYYY-MM-DD (KST)
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;

  // 월 변경 시엔 부모(transactions-section) 가 key={month} 로 리마운트해서
  // 이 컴포넌트가 새로 초기화된다. 그래서 selectedDate 는 단순 init state 로 충분.
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    today.startsWith(monthPrefix) ? today : `${monthPrefix}-01`,
  );

  // 캘린더 페이지 1호출 — 일별 합계 + 월간 합계 + by_category + 그달 거래 전부
  const { data: fullData } = useSuspenseQuery(
    queryKeys.transaction.calendarFull({ year, month }),
  );
  const calendar = fullData.body.data;
  const monthItems = calendar.transactions;

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

  const selectedTx = monthItems.filter(
    (it) => it.txDate.slice(0, 10) === selectedDate,
  );

  return (
    <Grid gutter="md" align="stretch">
      {/* 캘린더 — 모바일/패드 풀폭, 데스크탑(>=lg) 절반 */}
      <Grid.Col span={{ base: 12, lg: 6 }}>
      <Card p="md" h="100%">
        <Stack gap="sm">
          <SimpleGrid cols={7} spacing={4}>
            {DAY_LABELS.map((d, i) => (
              <Text
                key={d}
                size="10px"
                fw={700}
                ta="center"
                c={i === 0 ? "danger.5" : i === 6 ? "info.5" : "dimmed"}
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
                  ? "var(--mantine-color-danger-5)"
                  : dow === 6
                    ? "var(--mantine-color-info-5)"
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
                      ? SELECTED_BG
                      : isToday
                        ? TODAY_BG
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
                          c={isSelected ? "white" : "info.5"}
                        >
                          +{Math.round(stat.income / 10000)}만
                        </Text>
                      )}
                      {stat.expense > 0 && (
                        <Text
                          size="8px"
                          fw={700}
                          c={isSelected ? "white" : "danger.5"}
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
      </Grid.Col>

      {/* 선택일 거래 — 라벨을 카드 내부 헤더로 두어 좌측 달력 카드와 박스 크기 일치 */}
      <Grid.Col span={{ base: 12, lg: 6 }}>
        <Card p="md" h="100%">
          <Stack gap="sm" h="100%">
            <Text size="sm" fw={700}>
              {selectedDate.slice(5).replace("-", "월 ")}일 거래
            </Text>
            <div style={{ flex: 1, overflow: "auto" }}>
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
            </div>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
