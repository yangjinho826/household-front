import type { AssetClass } from "./types";

/**
 * 자산군별 배분 파이 색상 (hex — PortfolioDonut 용).
 * Warm Ledger 팔레트 (DESIGN.md). 카테고리 구분색이라 의미색(info/danger/positive)과 별개.
 * 부동산=브랜드 sage, 투자=terracotta, 현금=웜그레이, 연금=벽돌, 금=골드.
 */
export const ASSET_CLASS_COLOR: Record<AssetClass, string> = {
  REAL_ESTATE: "#7C9473", // sage (보통 최대 비중 → 브랜드색)
  INVESTMENT: "#D98E73", // terracotta
  CASH: "#C3B9A9", // 웜그레이 (중립)
  PENSION: "#C2674A", // terracotta-deep (벽돌)
  COMMODITY: "#E0B84C", // 골드 (금·원자재)
  OTHER: "#A99C8D", // 웜그레이 진한
};
