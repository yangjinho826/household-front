/**
 * 토스 스타일 시각 토큰 — hex 값 직접 참조용.
 *
 * Mantine theme 의 toss* 색상과 동일한 값이지만, 인라인 style 에서
 * 직접 hex (`${color}1A` 같은 알파 합성 등) 가 필요할 때 사용.
 */
export const TOKEN = {
  blue: "#3182F6",
  red: "#F04452",
  green: "#22C55E",
  purple: "#8B5CF6",
  gold: "#F59E0B",
  yellow: "#FFD600",
  orange: "#FF6B35",
} as const;

/** 색이 지정되지 않은 항목의 fallback */
export const DEFAULT_ACCENT = TOKEN.blue;
