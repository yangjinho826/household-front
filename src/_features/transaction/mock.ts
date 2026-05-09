import type { Transaction } from "./types";

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "income", amount: 3500000, accountId: "a1", categoryId: "c7", date: "2026-05-01", memo: "5월 월급" },
  { id: "t2", type: "expense", amount: 9180, accountId: "a1", categoryId: "c1", date: "2026-05-08", memo: "점심 - 김치찌개" },
  { id: "t3", type: "expense", amount: 1500, accountId: "a2", categoryId: "c2", date: "2026-05-08", memo: "지하철" },
  { id: "t4", type: "expense", amount: 45000, accountId: "a1", categoryId: "c4", date: "2026-05-07", memo: "저녁 데이트" },
  { id: "t5", type: "expense", amount: 65000, accountId: "a1", categoryId: "c3", date: "2026-05-06", memo: "관리비" },
  { id: "t6", type: "expense", amount: 32000, accountId: "a2", categoryId: "c5", date: "2026-05-05", memo: "쿠팡 생활용품" },
  { id: "t7", type: "expense", amount: 12000, accountId: "a1", categoryId: "c1", date: "2026-05-04", memo: "저녁 - 백반" },
  { id: "t8", type: "expense", amount: 18000, accountId: "a2", categoryId: "c6", date: "2026-05-03", memo: "영화관" },
  { id: "t9", type: "expense", amount: 7800, accountId: "a1", categoryId: "c1", date: "2026-05-02", memo: "아침 - 샌드위치" },
  { id: "t10", type: "transfer", amount: 300000, accountId: "a1", toAccountId: "a4", date: "2026-05-02", memo: "청년도약 적금" },
  { id: "t11", type: "transfer", amount: 500000, accountId: "a1", toAccountId: "a5", date: "2026-05-02", memo: "ISA 자동이체" },
];
