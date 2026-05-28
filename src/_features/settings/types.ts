/** GET /settings/overview 응답 — 설정 페이지 counts 묶음 */
export interface SettingsOverviewType {
  accountCount: number;
  categoryCount: number;
  fixedCount: number;
  transactionCount: number;
  portfolioCount: number;
}
