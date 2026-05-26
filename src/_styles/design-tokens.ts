/**
 * 디자인 시스템 시각 토큰 — hex 값 직접 참조용.
 *
 * Mantine theme 색상 키와 1:1 매핑. 인라인 style 에서 hex (`${color}1A`
 * 같은 알파 합성 등) 가 필요할 때 사용. 모든 값 Tailwind 500 시리즈 일관.
 */
export const TOKEN = {
  blue: "#3B82F6", // info.5 — Tailwind blue-500 (수입/안내)
  red: "#EF4444", // danger.5 — Tailwind red-500 (지출/위험)
  green: "#22C55E", // linerGreen.5 — Tailwind green-500 (primary/success)
  purple: "#8B5CF6", // purple.5 — Tailwind violet-500 (TRANSFER/INVESTMENT 보조)
  gold: "#F59E0B", // warning.5 — Tailwind amber-500 (주의)
  yellow: "#FCD34D", // warning.3 — 앰버 밝은 톤
  orange: "#D97706", // warning.6 — 앰버 진한 톤
} as const;

/** 색이 지정되지 않은 항목의 fallback — primary blue */
export const DEFAULT_ACCENT = TOKEN.blue;
