import type { AssetClass } from "_features/portfolio/types";

/** 수동자산(부동산·연금)이 가질 수 있는 자산 성격 — 투자종목 성격은 제외 */
export type ManualAssetClass = Extract<AssetClass, "REAL_ESTATE" | "PENSION">;

/** 부동산·연금 등록 — accountId 미지정 시 전용계좌 자동 연결 */
export interface ManualAssetCreateRequest {
  name: string;
  assetClass: ManualAssetClass;
  currentValuation: number;
  valuedAt: string; // YYYY-MM-DD
  accountId?: string | null;
}

/** 평가액/메타 수정 */
export interface ManualAssetUpdateRequest {
  manualAssetId: string;
  name?: string | null;
  assetClass?: ManualAssetClass | null;
  currentValuation?: number | null;
  valuedAt?: string | null;
  isArchived?: boolean | null;
}

export interface ManualAssetListItemType {
  manualAssetId: string;
  accountId: string;
  name: string;
  assetClass: ManualAssetClass;
  currentValuation: number;
  valuedAt: string; // YYYY-MM-DD
  isArchived: boolean;
}
