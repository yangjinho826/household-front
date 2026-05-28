# 결정 기록

> `/decide` 호출 시 결정 결과가 여기에 자동 append.
> 형식: `YYYY-MM-DD: <주제> — <선택 옵션> (<근거>)`

---

2026-05-28: API 호환 전략 — 기존 깨고 봉투 통일 (한 페이지 = 한 endpoint 사상으로 가는 게 명료, 점진은 어차피 모든 도메인 손대니 의미 없음)
2026-05-28: 종목 거래내역 분리 — 종목 단건 endpoint(`/items/{id}`) 와 거래내역(`/items/{id}/transactions`) 분리 (무한 스크롤 가능 + 거래 많아질 때 응답 비대 방지)
2026-05-28: 관리 페이지 페이징 방식 — 무한 스크롤(cursor) 도입 (페이지 단위 일관성 + Mantine `Pagination` 의 클라 페이지 흉내 제거)
2026-05-28: cursor 형식 — 평문 `{sort_key}|{uuid}` (transaction 의 기존 패턴 그대로 — 디버깅 가능, base64 불필요)
2026-05-28: totalCount 정책 — 관리 페이지에서만 count 계산, overview/무한 스크롤은 null (DB 부하 ↓)
2026-05-28: 종목 URL — `/portfolio/items/{id}` REST 적 (기존 `/detail/{id}` 폐기)
2026-05-28: 단일 브랜치 누적 — PR 0~6 모두 `refactor/api-cursor-overview` 한 브랜치에 (큰 단위 변경의 일관성 우선)
