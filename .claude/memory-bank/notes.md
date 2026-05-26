# 자유 메모

## 코드 리뷰 결과 (2026-05-19)

household-front + household-back 전체 아키텍처 리뷰 결과. 총 14개 작업 항목 도출 후 처리 / Skip / 명시 제외로 분류.

**Why**: 다음 세션에서 코드 리뷰 후속 작업 확인 시 어디까지 했는지 / 왜 안 했는지 빠르게 파악하기 위해. Skip 사유와 잠재 위험을 같이 기록해서 미래에 재고할 때 컨텍스트 보존.

**How to apply**: 사용자가 "리뷰 남은 작업" / "그때 뭐 했었지" / "F5 다시 하자" 같이 물으면 이 메모 참조. 새로 코드 리뷰 시작하기 전에도 이 표 보고 중복 / 충돌 작업 확인.

### 처리 완료 (8건)

| # | 작업 | 핵심 변경 |
|---|---|---|
| B1 | 프론트 error.PT001 i18n 키 | ko/en `error.PT001` 추가 |
| B2 / B3 | `CamelBaseModel` + Money/Rate float 직렬화 | 백엔드 9 도메인 schema CamelBaseModel 상속. 프론트 도메인별 `mapToListItem`/`mapToDetailItem` 수동 변환 제거 (`id → xxxId` 매핑 1줄만 유지) |
| F1 | members-section.tsx 한국어 → i18n | `household.member.*` 네임스페이스 18 키 추가, 한국어 하드코딩 16곳 제거 |
| F2 | color-picker 토큰화 | `TOKEN` 객체에 `yellow` / `orange` 추가 |
| F3 | transaction 필터 state → nuqs/use-search | `_features/transaction/hooks/use-sub/use-search.ts` 신설. URL 동기 |
| F6 | auth API 함수명 PascalCase | `GetMeApi` → `GetAuthMeApi` 등 5개 rename |
| F7 | mock-response 데드 코드 제거 | `mock-response.ts` 삭제 + env/deploy/CLAUDE.md 정리 |
| B6 | 페이징 패턴 docstring | `TransactionListResponse` + `ApiListResponse` 주석 |
| B7 | portfolio service 책임 docstring | `service.py` (CRUD) / `snapshot_service.py` (월별 박제) 분리 명시 |

### Skip — 사유 있음 (3건)

| # | 작업 | Skip 사유 |
|---|---|---|
| B4 | 라우터 `response_model=` 명시 | 함수 반환 타입 `-> ApiResponse[T]` 이미 명시돼서 FastAPI 가 OpenAPI 자동 반영. 60+ 엔드포인트 중복 ROI 낮음. 재고 시: Swagger 띄워보고 generic 으로 나오는 곳만 보강 |
| F4 | `useSuspenseQuery` 통일 | `useSuspenseQuery` 는 conditional 호출 X → create 모드와 호환 안 됨. `fetchQuery` 가 conditional fetch 에 합리적 |
| B3.5 | 프론트 `xxxId` → `id` 통일 | 86곳 영향 vs 매핑 1줄 절약 ROI 미묘. 라우트 `[accountId]/page.tsx` 와 의미 불일치 (params.accountId vs item.id 혼재). 별도 PR 로만 재고 |

### 명시 제외 — 사용자 결정 (3건)

리뷰 시점에 "F5/F8/B5 빼고 나머지 다" 라고 명시 제외. 잠재 위험 있지만 발생 빈도 낮음.

| # | 작업 | 잠재 위험 |
|---|---|---|
| F5 | `return-fetch-refresh.ts` module-scope `redirecting` 플래그 → 싱글톤 | 다중 탭 / iframe 환경 race condition |
| F8 | TanStack queryKey 명시적 필드 구성 | params 객체 순서 변경 시 캐시 miss |
| B5 | `get_db` commit 책임을 service 로 이전 | 라우터 예외 시 부분 commit 가능 (이론적) |

### 관련 커밋

`origin/dev` (양쪽 repo):
- 프론트: `7745544..704b2d5` (7 커밋 + autoMemoryDirectory 1 커밋 `8370e08`)
- 백엔드: `7204940..d969a57` (3 커밋 + autoMemoryDirectory 1 커밋 `ffb4773`)

## 외부 시스템 참조
(예: 버그 추적 Linear 위치, 모니터링 대시보드 URL)

## 학습 노트
(이 프로젝트에서 배운 패턴/팁)

## 참고 링크
(자주 참조하는 docs/북마크)
