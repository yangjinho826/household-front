import { useTranslations } from "next-intl";

/**
 * "YYYY-MM" 또는 "YYYY-MM-DD" → 로케일 월 레이블.
 * ko "5월" / en "5" (`general.n_month`). 차트 축·월 표기 공용.
 */
export function useMonthLabel() {
  const t = useTranslations("general");
  return (isoDate: string): string =>
    t("n_month", { count: Number(isoDate.slice(5, 7)) });
}
