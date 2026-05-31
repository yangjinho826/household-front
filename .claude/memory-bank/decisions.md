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
2026-05-28: codex 외부 모델 교차 리뷰 도입 — High 1 + Med 4 fix 후 머지 결정 (PR 7) (`account.list._def` 만 잡고 `account.infinite` 누락한 invalidation 버그가 실 UI stale 로 이어지는 결정적 발견)
2026-05-28: settings 의 household.list + settings.overview 2호출은 의식적 예외 — 묶지 않음 (의미/캐시 수명 다름, 백엔드 추가 변경 회피)
2026-05-28: household list 페이징 정책 — cursor 봉투 형식 유지 + `HOUSEHOLD_LIST_LIMIT=200` unbounded (가계부는 사용자당 수십개 이내, switcher 는 한번에 표시 필요, infinite 는 over-engineering)

2026-05-31: 가계부×자산 통합 범위 — 총자산만 (부채/순자산 안 함) — 복잡도 축소, 빚 따로 관리. 나중에 확장 시 스냅샷 스키마 재작업 필요
2026-05-31: 평단 방식 — 이동평균 유지 (lot/cost basis 안 만듦) — codex 권고, MVP에 lot은 과함. 매도행에 실현손익 박제로 충분
2026-05-31: MVP를 R1으로 축소 — 자동박제+전월대비증감만 1차 릴리스. 나머지(원인분해/실현손익/계좌별리포트/drill-down)는 R2~로 — codex "데이터모델 신뢰도 먼저, 기능 확장은 그 다음"
2026-05-31: 디자인 audit는 R1 화면 확정 후 별도 트랙 — R1이 /wealth 화면을 바꾸므로 미리 audit하면 재작업
