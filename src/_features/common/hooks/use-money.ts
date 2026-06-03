import { useTranslations } from "next-intl";

import { fmt } from "_utilities/fmt";

/**
 * 금액 → 로케일별 통화 표기.
 * ko: "1,000원" (suffix) / en: "₩1,000" (prefix) — `general.money` ICU 메시지로 분기.
 */
export function useMoney() {
  const t = useTranslations("general");
  return (amount: number): string => t("money", { amount: fmt(amount) });
}
