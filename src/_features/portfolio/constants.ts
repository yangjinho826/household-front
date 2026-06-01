import type { AssetClass } from "./types";

/** 자산 성격별 배분 파이 색상 (hex — PortfolioDonut 용). */
export const ASSET_CLASS_COLOR: Record<AssetClass, string> = {
  STOCK: "#3B82F6", // 파랑
  BOND: "#10B981", // 초록
  COMMODITY: "#F59E0B", // 금색
  CASH: "#6B7280", // 회색
  REAL_ESTATE: "#8B5CF6", // 보라
  PENSION: "#EC4899", // 핑크
  OTHER: "#94A3B8", // 연회색
};
