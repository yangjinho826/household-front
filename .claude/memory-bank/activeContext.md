# 활성 컨텍스트

## Goal

가계부 API 리팩토링 **완료** — 한 페이지 = 한 endpoint (overview 도입) +
모든 list 응답 `CursorPage[T]` 봉투 통일 + 관리 페이지 무한 스크롤 도입.
단일 브랜치 `refactor/api-cursor-overview` 에 PR 0~6 누적 완료.
다음 작업은 이 브랜치를 main 으로 머지 (PR/리뷰).

## Status

### 완료 (브랜치 `refactor/api-cursor-overview`)

| 커밋 | 레포 | 내용 |
|---|---|---|
| `041ea3a` | back | refactor: CursorPage 봉투 통일 + portfolio overview 도입 (PR 0+1) |
| `fdb3c38` | back | refactor: account/category/fixed list 무한 스크롤 (PR 2) |
| `ff9c421` | back | refactor: home/wealth/settings overview endpoint 추가 (PR 3) |
| `68e995b` | back | refactor: transaction calendar/full + form-options endpoint 추가 (PR 4) |
| `24aad03` | back | refactor: household/members list 응답 CursorPage 봉투 통일 (PR 5) |
| `69b7e0a` | back | refactor: deprecated /transaction/calendar endpoint 제거 (PR 6) |
| `6d63363` | front | refactor: CursorPage 봉투 통일 + portfolio overview 도입 (PR 0+1) |
| `7f02c01` | front | chore(memory): activeContext PR 0+1 완료 반영 |
| `0907892` | front | refactor: account/category/fixed 관리 페이지 무한 스크롤 (PR 2) |
| `060f750` | front | refactor: home/wealth/settings overview 1호출 통합 (PR 3) |
| `d1fce6e` | front | refactor: transaction 캘린더/폼 1호출 통합 (PR 4) |
| `1eca7af` | front | refactor: household/members 프론트 봉투 매핑 CursorPage 통일 (PR 5) |
| `4156b0f` | front | refactor: ApiListResponse / 페이징 매직 넘버 / 데드 코드 정리 (PR 6) |

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

#### PR 4 — transaction calendar/full + form-options
- 백엔드 신규 endpoint:
  - `GET /transaction/calendar/{year}/{month}/full` — days + 월간 totals + by_category(stats) + 그달 거래 전부
  - `GET /transaction/form-options` — accounts + categories + fixedExpenses (활성)
- 백엔드: stats.get_monthly_stats / list_transactions / account/category/fixed list_* 위임만
- 프론트: transaction api/types/query-key 에 `calendarFull` / `formOptions` 추가
- 프론트: calendar-view 2호출 → 1호출, form 3호출 → 1호출
- 프론트: fixed mutation invalidation 에 transaction._def 추가 (formOptions stale 반영)
- transaction._def invalidate 가 calendarFull/formOptions/list/calendar/detail 모두 잡아주므로 다른 mutation 의 invalidation 은 변경 X
- `/transaction/calendar` 기존 endpoint 는 일단 유지 (deprecated 표시 X — PR 6 에서 데드코드 검토)

#### PR 5 — household / members 봉투 통일
- 백엔드: `/household/list`, `/household/{id}/members` 응답을 `list[T]` → `CursorPage[T]`
  - `HouseholdListResponse = CursorPage[HouseholdResponse]`, `HouseholdMemberListResponse = CursorPage[HouseholdMemberResponse]` alias 추가
  - 작은 list 라 cursor 페이징 의미 X — next_cursor=None, has_next=False, total_count=len 로 형식만 통일
- 프론트: `_features/household/api.ts` 의 `ApiListResponse(content/totalElements)` 어댑터를 `ApiCursorPage(items/totalCount)` 로 정리
- 프론트: `queryKeys.household.list({...})` → `queryKeys.household.list()` (인자 제거)
- 프론트: 8개 호출처 (`settings/members/household section`, `layout/{app-header,sidebar-nav}`, `household/{household-switcher,use-search}`, `auth/onboarding-guard`) `.content` → `.items` / `.totalElements` → `.totalCount` 일괄 교체

#### PR 6 — 정리 (마지막)
- 백엔드: deprecated `/transaction/calendar` 라우터 삭제 (calendar/full 로 대체, service.get_calendar 는 내부 위임 유지)
- 프론트 `_libraries/fetch/response.ts`: `ApiListResponse` / `ApiPaginationProps` 삭제 (CursorPage 만 남음)
- 프론트 transaction: `GetTransactionCalendarApi` / `TransactionCalendarResponse` / `useTransactionList` / `params.listSize` fallback 모두 제거
- 프론트 데드 컴포넌트 삭제: `_features/{portfolio,transaction}/components/table.tsx` (PR 2 무한 스크롤 후 호출처 없음 — Mantine `Pagination` 사용했던 잔재)
- 프론트 household: `components/table.tsx` 의 pageNo/listSize/totalPages prop 제거, `hooks/use-sub/use-search.ts` 의 nuqs pageNo/listSize 제거, `household-section` 도 단순화

### 남은 PR

전체 완료 ✅ — `refactor/api-cursor-overview` 브랜치 main 머지만 남음.

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

API 리팩토링 PR 0~6 모두 완료. `refactor/api-cursor-overview` 브랜치에 누적.

1. (백엔드/프론트 각각) main 으로 PR 올리기 — push + gh pr create
2. CHANGELOG/문서 갱신 필요 시 (백엔드 `docs/api-list.md` 의 `/transaction/calendar` 행 제거 등)
3. 머지 후 브랜치 정리
