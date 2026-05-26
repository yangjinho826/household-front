/**
 * Liner 디자인 시스템 시각 토큰 — hex 값 직접 참조용.
 *
 * Mantine theme 의 색상 키와 1:1 매핑이지만, 인라인 style 에서
 * 직접 hex (`${color}1A` 같은 알파 합성 등) 가 필요할 때 사용.
 *
 * 통일성 — 모든 값이 새 디자인 시스템 (linerGreen / success / danger /
 * warning / info) 안에서 선택. 보라 톤은 옅은 그린으로 대체.
 */
export const TOKEN = {
  blue: "#339AF0", // info.5 — 캄 블루 강조
  red: "#FF6B6B", // danger.5 — warm red (지출)
  green: "#265A3A", // linerGreen.5 — primary + 수입/저축 통합
  purple: "#62A080", // linerGreen.4 — 옅은 그린 (보라 대체, TRANSFER/INVESTMENT)
  gold: "#F59F00", // warning.7 — 앰버 진한 톤
  yellow: "#FFD43B", // warning.4 — 앰버 밝은 톤
  orange: "#D9480F", // warning.9 — 앰버 가장 진한 톤
} as const;

/** 색이 지정되지 않은 항목의 fallback — Liner primary */
export const DEFAULT_ACCENT = TOKEN.green;
