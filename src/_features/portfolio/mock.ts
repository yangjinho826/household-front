import { MOCK_INVESTMENT_ACCOUNT_ID, accountMockStore } from "_features/account/mock";
import { newId, todayIso } from "_utilities/fmt";

import type {
  PortfolioBuyRequest,
  PortfolioCreateRequest,
  PortfolioListItemType,
  PortfolioSellRequest,
  PortfolioTransactionItemType,
  PortfolioTxType,
  PortfolioUpdateRequest,
} from "./types";

const HOUSEHOLD_ID = "h-mock-1";
const ACCOUNT_ID = MOCK_INVESTMENT_ACCOUNT_ID;

// 명시적 portfolio ID
export const MOCK_PORTFOLIO_ID_1 = "p-mock-1";
export const MOCK_PORTFOLIO_ID_2 = "p-mock-2";
export const MOCK_PORTFOLIO_ID_3 = "p-mock-3";

interface MockPortfolioRow {
  portfolioId: string;
  householdId: string;
  accountId: string;
  ticker: string;
  symbol: string | null;
  quantity: number;
  avgPrice: number;
  currentPrice: number; // 단가
  isArchived: boolean;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}

let store: MockPortfolioRow[] = [
  {
    portfolioId: MOCK_PORTFOLIO_ID_1,
    householdId: HOUSEHOLD_ID,
    accountId: ACCOUNT_ID,
    ticker: "TIGER 미국S&P500",
    symbol: "360750",
    quantity: 50,
    avgPrice: 18_000,
    currentPrice: 21_000, // 50 × 21000 = 1,050,000
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    portfolioId: MOCK_PORTFOLIO_ID_2,
    householdId: HOUSEHOLD_ID,
    accountId: ACCOUNT_ID,
    ticker: "삼성전자",
    symbol: "005930",
    quantity: 100,
    avgPrice: 65_000,
    currentPrice: 72_000, // 100 × 72000 = 7,200,000
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
  {
    portfolioId: MOCK_PORTFOLIO_ID_3,
    householdId: HOUSEHOLD_ID,
    accountId: ACCOUNT_ID,
    ticker: "QQQ",
    symbol: "QQQ",
    quantity: 10,
    avgPrice: 400_000,
    currentPrice: 450_000, // 10 × 450000 = 4,500,000
    isArchived: false,
    frstRegDt: todayIso(),
    lastMdfcnDt: todayIso(),
    dataStatCd: "ACTIVE",
  },
];

const txStore: PortfolioTransactionItemType[] = [];
let txRowSeq = 0;

function buildItem(row: MockPortfolioRow, rowNo: number): PortfolioListItemType {
  const account = accountMockStore.list().find((a) => a.accountId === row.accountId);
  const cost = row.quantity * row.avgPrice;
  const currentValue = row.quantity * row.currentPrice;
  const profitLoss = currentValue - cost;
  const profitLossRate = cost > 0 ? (profitLoss / cost) * 100 : 0;
  return {
    rowNo,
    portfolioId: row.portfolioId,
    accountId: row.accountId,
    accountName: account?.name ?? "(삭제됨)",
    ticker: row.ticker,
    symbol: row.symbol,
    quantity: row.quantity,
    avgPrice: row.avgPrice,
    currentPrice: row.currentPrice,
    cost,
    currentValue,
    profitLoss,
    profitLossRate,
    isArchived: row.isArchived,
    householdId: row.householdId,
    frstRegDt: row.frstRegDt,
    lastMdfcnDt: row.lastMdfcnDt,
    dataStatCd: row.dataStatCd,
  };
}

function pushTransaction(
  row: MockPortfolioRow,
  type: PortfolioTxType,
  quantity: number,
  price: number,
  txDate: string | undefined,
  memo: string | null | undefined,
) {
  txRowSeq += 1;
  const account = accountMockStore.list().find((a) => a.accountId === row.accountId);
  txStore.unshift({
    rowNo: txRowSeq,
    txId: newId(),
    accountId: row.accountId,
    accountName: account?.name ?? "(삭제됨)",
    ticker: row.ticker,
    symbol: row.symbol,
    ptType: type,
    quantity,
    price,
    total: quantity * price,
    txDate: txDate ?? todayIso(),
    memo: memo ?? null,
  });
}

export const portfolioMockStore = {
  list(params?: { accountId?: string }): PortfolioListItemType[] {
    let rows = store.filter((r) => !r.isArchived);
    if (params?.accountId) {
      rows = rows.filter((r) => r.accountId === params.accountId);
    }
    return rows.map((r, idx) => buildItem(r, idx + 1));
  },
  detail(id: string): PortfolioListItemType | undefined {
    const row = store.find((r) => r.portfolioId === id);
    return row ? buildItem(row, 1) : undefined;
  },

  /** 종목 등록 — 메타만 (qty=0 시작) */
  create(req: PortfolioCreateRequest): PortfolioListItemType {
    const created: MockPortfolioRow = {
      portfolioId: newId(),
      householdId: HOUSEHOLD_ID,
      accountId: req.accountId,
      ticker: req.ticker,
      symbol: req.symbol ?? null,
      quantity: 0,
      avgPrice: 0,
      currentPrice: req.currentPrice,
      isArchived: false,
      frstRegDt: todayIso(),
      lastMdfcnDt: todayIso(),
      dataStatCd: "ACTIVE",
    };
    store = [created, ...store];
    return buildItem(created, 1);
  },

  /** 매수 — 기존 종목 qty 누적 + avg_price 재계산 + 이력 기록 */
  buy(req: PortfolioBuyRequest): PortfolioListItemType {
    const row = store.find((r) => r.portfolioId === req.portfolioId);
    if (!row) throw new Error("portfolio not found");
    const newQuantity = row.quantity + req.quantity;
    const newCost = row.quantity * row.avgPrice + req.quantity * req.price;
    row.avgPrice = newQuantity > 0 ? Math.round(newCost / newQuantity) : 0;
    row.quantity = newQuantity;
    row.lastMdfcnDt = todayIso();
    pushTransaction(row, "BUY", req.quantity, req.price, req.txDate, req.memo);
    return buildItem(row, 1);
  },

  /** 매도 — 부분/전량. 전량 시 archive */
  sell(req: PortfolioSellRequest): PortfolioListItemType | null {
    const row = store.find((r) => r.portfolioId === req.portfolioId);
    if (!row) throw new Error("portfolio not found");
    if (req.quantity > row.quantity) throw new Error("INSUFFICIENT_QUANTITY");
    pushTransaction(row, "SELL", req.quantity, req.sellPrice, req.txDate, req.memo);
    row.quantity -= req.quantity;
    row.lastMdfcnDt = todayIso();
    if (row.quantity === 0) {
      row.isArchived = true;
      return null;
    }
    return buildItem(row, 1);
  },

  /** 평가액/메타 수정 */
  update(req: PortfolioUpdateRequest): PortfolioListItemType {
    const row = store.find((r) => r.portfolioId === req.portfolioId);
    if (!row) throw new Error("portfolio not found");
    if (req.currentPrice !== null && req.currentPrice !== undefined) {
      row.currentPrice = req.currentPrice;
    }
    if (req.ticker !== null && req.ticker !== undefined) row.ticker = req.ticker;
    if (req.symbol !== undefined) row.symbol = req.symbol;
    if (req.isArchived !== null && req.isArchived !== undefined) {
      row.isArchived = req.isArchived;
    }
    row.lastMdfcnDt = todayIso();
    return buildItem(row, 1);
  },

  /** 거래 이력 조회 (BUY/SELL) */
  transactions(params?: { accountId?: string }): PortfolioTransactionItemType[] {
    let txs = txStore;
    if (params?.accountId) {
      txs = txs.filter((t) => t.accountId === params.accountId);
    }
    return txs.map((t, idx) => ({ ...t, rowNo: idx + 1 }));
  },
};
