/**
 * 포매터 / ID 생성 / 날짜 헬퍼 — 도메인 무관
 */

export const fmt = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

export const todayIso = (): string => new Date().toISOString().slice(0, 10);

export const newId = (): string => Math.random().toString(36).slice(2, 10);
