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

2026-06-01: R4 계좌 추이 차트 데이터 소스 — 종목 합산(valueHistoryByAccount) 대신 통장 전체 자산(account_snapshot balance) (hero "통장 전체 자산"과 일치 + 현금 포함이 사용자 직관에 맞음. valueHistoryByAccount API는 남겨둠)
2026-06-01: R4 차트 = drill-down/표 없이 라인차트만 — 계좌=통장 전체 추이 / 종목=평가액 추이로 역할 분리 (사용자: 깔끔하게 차트만. R2 월클릭 분해는 자산 메인에만)
2026-06-01: 일반통장 상세도 R4 차트 적용 — account-report-section 월별 내역 표를 잔액 추이 차트로 교체 (모든 통장 상세에서 일관된 추이 UX)
2026-06-01: recharts SSR 대응 — useSyncExternalStore 마운트 가드로 클라 전용 렌더 (dynamic ssr:false 대신. set-state-in-effect lint 회피 + hydration-safe)

2026-06-01: R5a asset_class 2축 분리 — market(거래소) 유지 + asset_class(자산성격) 신규 축 (1축이면 금ETF를 COMMODITY 분류 시 market을 OTHER로 바꿔 야후갱신 끊김 딜레마. 2축은 갱신=market·분류=asset_class 독립. codex 검증)
2026-06-01: 부동산·연금 모델 — ManualAsset 신규 도메인 + 전용계좌(REAL_ESTATE/PENSION) roll-up (PortfolioItem은 market/qty/avg_price가 부동산에 안 맞음. 전용계좌 roll-up하면 총자산·추이 자동 반영. codex D1=B)
2026-06-01: 월별 배분추이 — asset_class_snapshots 전용 테이블 (account_snapshot은 계좌총액만 저장해 asset_class 슬라이스 재구성 불가. codex "aggregation loss")
2026-06-01: R5a 전체 한 사이클 + 단계 커밋 — R5a-1/2/3 순차, 마이그레이션 A/B/C 독립 (사용자: 전체 한번에. 단 스냅샷 의미변경을 모델 마이그레이션에 묻지 말 것 — codex)
2026-06-01: asset_class 백필 — 전부 STOCK 기본값 + UI에서 사용자 재분류 (금을 code/name LIKE로 SQL 추측 UPDATE 안 함)
