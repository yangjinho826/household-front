import type { PortfolioItem } from "./types";

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  { id: "p1", name: "TIGER 미국S&P500", broker: "ISA", quantity: 50, currentValue: 6250000, avgPrice: 120000 },
  { id: "p2", name: "KODEX 200", broker: "ISA", quantity: 30, currentValue: 3150000, avgPrice: 100000 },
  { id: "p3", name: "삼성전자", broker: "ISA", quantity: 40, currentValue: 3100000, avgPrice: 70000 },
  { id: "p4", name: "TIGER 차이나전기차", broker: "연금저축", quantity: 100, currentValue: 4500000, avgPrice: 42000 },
  { id: "p5", name: "KODEX 코스닥150", broker: "연금저축", quantity: 80, currentValue: 4400000, avgPrice: 53000 },
];
