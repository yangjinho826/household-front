import { C } from "_styles/design-tokens";
import type { Account } from "./types";

export const INITIAL_ACCOUNTS: Account[] = [
  { id: "a1", name: "기업은행 주거래", type: "생활", balance: 1181659, startBalance: 1500000, color: C.blue, icon: "building" },
  { id: "a2", name: "신한 SOL", type: "생활", balance: 532400, startBalance: 800000, color: "#0046FF", icon: "building" },
  { id: "a3", name: "카카오뱅크 세이프", type: "적립", balance: 3200000, startBalance: 3000000, color: "#FFD600", icon: "piggy" },
  { id: "a4", name: "청년도약계좌", type: "적립", balance: 4800000, startBalance: 4500000, color: C.green, icon: "piggy" },
  { id: "a5", name: "ISA (토스증권)", type: "투자", balance: 12500000, startBalance: 12000000, color: C.purple, icon: "trending" },
  { id: "a6", name: "연금저축 (한투)", type: "투자", balance: 8900000, startBalance: 8500000, color: "#FF6B35", icon: "trending" },
];
