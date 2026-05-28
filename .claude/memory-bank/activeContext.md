# 활성 컨텍스트

## Goal

가계부 API 리팩토링 — 한 페이지 = 한 endpoint (overview 도입) + 모든 list 응답을
`CursorPage[T]` 봉투로 통일 + 관리 페이지 무한 스크롤 도입. 단일 브랜치
`refactor/api-cursor-overview` 에 PR 0~6 누적.

## Status

### 완료 (브랜치 `refactor/api-cursor-overview`)

| 커밋 | 레포 | 내용 |
|---|---|---|
| `041ea3a` | back | refactor: CursorPage 봉투 통일 + portfolio overview 도입 (PR 0+1) |
| `fdb3c38` | back | refactor: account/category/fixed list 무한 스크롤 (PR 2) |
| `ff9c421` | back | refactor: home/wealth/settings overview endpoint 추가 (PR 3) |
| `6d63363` | front | refactor: CursorPage 봉투 통일 + portfolio overview 도입 (PR 0+1) |
| `7f02c01` | front | chore(memory): activeContext PR 0+1 완료 반영 |
| `0907892` | front | refactor: account/category/fixed 관리 페이지 무한 스크롤 (PR 2) |
| `060f750` | front | refactor: home/wealth/settings overview 1호출 통합 (PR 3) |

#### PR 0 — 봉투 통일 인프라
- 백엔드: `app/core/pagination.py` (`CursorPage[T]`), `TransactionListResponse` 를 alias 로
- 프론트: `ApiCursorPage<T>` 추가, transaction api content → items 통일
- 부가 fix: `useTransactionInfiniteList` queryKey 를 factory 통과 → `_def` invalidate 잡힘
- 부가 fix: transaction mutation 에 `stats._def` invalidate 누락 추가

#### PR 1 — portfolio overview/item/form-options
- 백엔드 신규: `/portfolio/overview`, `/accounts/{id}/overview`, `/items/{id}`,
  `/items/{id}/transactions` (cursor), `/form-options`
- 백엔드 제거: `/portfolio/list`, `/transactions`, `/detail/{id}`
- 프론트: 4 페이지 + 1 폼 모두 1호출 전환, `portfolio-trade-section` 무한 스크롤 적용
- settings 의 portfolio 카운트는 overview flatMap 으로 임시 처리 (PR 3 에서 settings.counts 로 대체)

#### PR 2 — account/category/fixed 관리 페이지 무한 스크롤
- 백엔드: 세 도메인 repository `list_by_cursor` + `count_search` (frst_reg_dt DESC)
- 백엔드: service 내부용 `list_X` (sort_order) 유지 + 외부용 `list_X_cursor` 신규
- 백엔드: router `/list` → `CursorPage[XResponse]`, schema `ListQuery` cursor/limit
- 프론트: `_libraries/query/infinite-sentinel.tsx` 공용 헬퍼
- 프론트: 세 도메인 api/query-key/use-query/use-search/table/section 무한 스크롤 전환
- 다른 페이지 임시 패치: transaction/form, home/settings/wealth section (content→items, listSize→limit)

#### PR 3 — home / wealth / settings overview
- 백엔드 신규: `app/domain/{home,wealth,settings}/` (router/service/schema)
- 백엔드 신규 endpoint: `GET /home/overview`, `GET /wealth/overview`, `GET /settings/overview`
- 백엔드: `PortfolioItemRepository.count_active_by_household_id` 추가 (settings 카운트용)
- 백엔드 위임 패턴: 기존 도메인 service 호출만 (account/transaction/stats/account_snapshot)
- 프론트 신규: `_features/{home,wealth,settings}/` (api/types/query-key)
- 프론트: home 4→1호출, wealth 2→1호출, settings 6→2호출 (settings.overview + household.list)
- 프론트: 각 도메인 mutation invalidation 에 home/wealth/settings._def 추가
- 결정 #4 ("stats 도메인 유지") 일관: `/stats/monthly` endpoint 그대로, home.overview 안에 데이터만 포함
- 결정 #5 ("wealth.overview 에 accounts 포함"): wealth.overview 안에 통장 목록 + yearly_snapshots, 통장 클릭 시 `/portfolio/accounts/{id}/overview` 별도 유지

### 남은 PR

| PR | 작업 |
|---|---|
| 4 | transaction calendar/{year}/{month}/full + transaction form-options |
| 5 | household / members 봉투만 통일 |
| 6 | 정리 (`pageNo/listSize` 매직 넘버, 클라 필터, `ApiListResponse` 삭제, 데드 코드) |

## Context

### 사용자 결정 (8가지)

| # | 결정 |
|---|---|
| 1 | cursor 형식: 평문 `{sort_key}\|{uuid}` (transaction 패턴 그대로) |
| 2 | totalCount: 관리 페이지만 count, overview/infinite 는 null |
| 3 | PR 0 안에 stats invalidation + infinite key 버그 같이 fix |
| 4 | stats 도메인 유지 (home.overview 와 별도, 나중에 흡수 검토) |
| 5 | wealth.overview 안에 accounts 포함 |
| 6 | 종목 거래내역 page size 30 (transaction 동일) |
| 7 | URL `/portfolio/items/{id}` REST 적 |
| 8 | PR 순서: 인프라 → portfolio → 관리 → home/wealth/settings → calendar/form-options → household → 정리 |

### 기술 결정

- **호환 전략**: "기존 깨고 통일". `ApiListResponse` 는 deprecated 표시만 두고 마지막 PR 6 에서 삭제
- **cursor 정렬**: account/category/fixed `created_at DESC, id DESC` / portfolio.tx `tx_date DESC, id DESC`
- **봉투 통일**: 모든 list 응답이 `CursorPage[T]` (백엔드) ↔ `ApiCursorPage<T>` (프론트)
- **detail API 활용**: 종목/통장/카테고리/고정지출 단건은 detail endpoint (list 에서 find 패턴 폐기)
- **클라 필터 제거**: 백엔드 쿼리 (`accountId`, `kind`, `accountType=INVESTMENT`, `isArchived` 등) 활용

### 제약

- 단일 브랜치 `refactor/api-cursor-overview` 에 누적 (PR 분리 X)
- 룰 체인 준수 (common / typescript / typescript-react / typescript-nextjs / cnnet 응답 래퍼 사상)
- 프론트 `pnpm typecheck` 매 단계 통과 / 백엔드 import 검증
- 데드 코드 즉시 제거

## Next Step

PR 4 진행 — transaction calendar/{year}/{month}/full + transaction form-options.

1. 백엔드: `/transaction/calendar/{year}/{month}/full` 신규 — 달력 + 월간 stats + 카테고리별 합계를 1호출로 (현재는 `/transaction/calendar` 와 `/stats/monthly` 분리)
2. 백엔드: `/transaction/form-options` 신규 — 거래 폼이 필요한 accounts/categories/fixedExpenses 한 번에
3. 프론트: transaction calendar / form section 1호출 전환
4. typecheck + 커밋
