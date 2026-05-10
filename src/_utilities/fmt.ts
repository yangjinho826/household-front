/**
 * 포매터 / ID 생성 / 날짜 헬퍼 — 도메인 무관
 */

import { todayIsoKst } from "./datetime";

export const fmt = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

/** "YYYY-MM-DD" — KST 기준. 신규 코드는 todayIsoKst 직접 사용 권장 */
export const todayIso = (): string => todayIsoKst();

export const newId = (): string => Math.random().toString(36).slice(2, 10);
