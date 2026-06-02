/**
 * 디자인 시스템 시각 토큰 — hex 값 직접 참조용 (인라인 style / 알파 합성).
 *
 * Warm Ledger 무드 (DESIGN.md). Mantine theme 색상 키와 매핑되지만,
 * `${color}1A` 같은 알파 합성이나 비-Mantine 컨텍스트에서 hex 가 필요할 때 사용.
 */
export const TOKEN = {
  // 브랜드 / 표면
  sage: "#7C9473", // primary 브랜드
  sageAction: "#647A5C", // filled 버튼 (primaryShade 6 — 흰 텍스트 대비 확보)
  terracotta: "#D98E73", // accent
  bg: "#FAF6EF", // 페이지 배경 (크림)
  card: "#FFFDF9", // 카드 표면
  text: "#3C3530", // 본문 텍스트
  textDim: "#7A6F63", // 보조 텍스트 (gray.6 — 대비 확보)

  // 의미색 (관습 유지)
  blue: "#3B82F6", // info — 수입/생활/안내
  red: "#EF4444", // danger — 지출/하락/위험
  purple: "#8B5CF6", // 투자 보조
  positive: "#2F855A", // 양수/수익/상승/적립 (구 green #22C55E 대체)

  // 차트·팔레트 구분색
  gold: "#F59E0B", // 자산군 (금·원자재 등)
  yellow: "#FCD34D",
  orange: "#D97706",

  // 차트 카테고리 팔레트 (Warm Ledger) — 자산군 배분·종목 구분 공용 단일 소스
  brick: "#C2674A", // terracotta-deep (연금 등)
  goldSoft: "#E0B84C", // 차분한 골드 (금·원자재 — gold #F59E0B 보다 톤다운)
  warmGray: "#C3B9A9", // 웜그레이 (현금 등 중립)
  warmGrayDeep: "#A99C8D", // 진한 웜그레이 (기타)
  dustyBlue: "#8FA9B8", // 차분한 블루 (웜 팔레트의 cool accent)
  caramel: "#B08968", // 캐러멜 브라운
  dustyRose: "#A67C8C", // 더스티 로즈
} as const;

/**
 * 종목 구분 팔레트 — Warm Ledger 무드 7색.
 * 자산군 색(ASSET_CLASS_COLOR)과 같은 톤이되 채도·명도로 종목 간 구분 확보.
 * 원색(blue/red/purple)을 쓰면 자산군 웜톤과 한 화면에서 충돌해 톤다운 버전 사용.
 */
export const PORTFOLIO_PALETTE = [
  TOKEN.terracotta,
  TOKEN.sage,
  TOKEN.goldSoft,
  TOKEN.brick,
  TOKEN.dustyBlue,
  TOKEN.caramel,
  TOKEN.dustyRose,
] as const;

/** 색이 지정되지 않은 항목의 fallback — 브랜드 sage */
export const DEFAULT_ACCENT = TOKEN.sage;
