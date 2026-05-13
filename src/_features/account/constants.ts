import { TOKEN } from "_styles/design-tokens";

import type { AccountType } from "./types";

/** AccountType → Mantine 색상 키 (tossXxx) */
export const ACCOUNT_TYPE_MANTINE_COLOR: Record<AccountType, string> = {
  LIVING: "tossBlue",
  SAVINGS: "tossGreen",
  INVESTMENT: "tossPurple",
};

/** AccountType → hex (IconBox 등 직접 색이 필요한 곳) */
export const ACCOUNT_TYPE_HEX: Record<AccountType, string> = {
  LIVING: TOKEN.blue,
  SAVINGS: TOKEN.green,
  INVESTMENT: TOKEN.purple,
};

/** 정렬 순서 (생활 → 적립 → 투자) */
export const ACCOUNT_TYPE_ORDER: AccountType[] = [
  "LIVING",
  "SAVINGS",
  "INVESTMENT",
];
