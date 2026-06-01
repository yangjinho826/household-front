import { TOKEN } from "_styles/design-tokens";

import type { AccountType } from "./types";

/** AccountType → Mantine 색상 키 (tossXxx) */
export const ACCOUNT_TYPE_MANTINE_COLOR: Record<AccountType, string> = {
  LIVING: "info",
  SAVINGS: "linerGreen",
  INVESTMENT: "purple",
  OTHER: "gray",
};

/** AccountType → hex (IconBox 등 직접 색이 필요한 곳) */
export const ACCOUNT_TYPE_HEX: Record<AccountType, string> = {
  LIVING: TOKEN.blue,
  SAVINGS: TOKEN.green,
  INVESTMENT: TOKEN.purple,
  OTHER: "#8B95A1",
};

/** 정렬 순서 (생활 → 적립 → 투자 → 기타) */
export const ACCOUNT_TYPE_ORDER: AccountType[] = [
  "LIVING",
  "SAVINGS",
  "INVESTMENT",
  "OTHER",
];

const ACCOUNT_TYPE_SET = new Set<string>(ACCOUNT_TYPE_ORDER);

/** 백엔드 enum 응답(string[])에서 유효한 AccountType 만 좁히는 런타임 가드 */
export const isAccountType = (value: string): value is AccountType =>
  ACCOUNT_TYPE_SET.has(value);
