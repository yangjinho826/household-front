# 활성 컨텍스트

## Goal

가계부 API 리팩토링 — 한 페이지 = 한 endpoint (overview 도입) + 모든 list 응답을
`CursorPage[T]` 봉투로 통일 + 관리 페이지 무한 스크롤 도입. 단일 브랜치
`refactor/api-cursor-overview` 에 PR 0~6 누적.

## Status

### 완료 (브랜치 `refactor/api-cursor-overview`, 1 커밋씩 두 레포)

| 커밋 | 레포 | 내용 |
|---|---|---|
| `041ea3a` | back | refactor: CursorPage 봉투 통일 + portfolio overview 도입 (PR 0+1) |
| `6d63363` | front | refactor: CursorPage 봉투 통일 + portfolio overview 도입 (PR 0+1) |

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

### 남은 PR

| PR | 작업 |
|---|---|
| 2 | account / category / fixed 관리 페이지 무한 스크롤 + CursorPage 적용 |
| 3 | home / wealth / settings overview |
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

PR 2 진행 — account / category / fixed 관리 페이지 무한 스크롤 + CursorPage 적용.

1. 백엔드: 세 도메인 repository 에 `list_by_cursor` + service 갱신, schema 응답 `CursorPage[T]` 로 교체
2. 프론트: `_libraries/query/use-infinite-list.ts` 헬퍼 + `infinite-sentinel.tsx`, 세 도메인 `use-search.ts` 갱신, table 의 Mantine `Pagination` 제거
3. typecheck + 커밋
