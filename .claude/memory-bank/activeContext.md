# 활성 컨텍스트

## Goal

**가계부 × 자산 통합 — 월별 자산변동 추적** 기능 구축.
핵심 목적: "매월 내 자산이 어떻게 변하는지 한눈에" (총자산 기준, 부채/순자산 안 함 — 사용자 결정).

R1(자동 박제 + 전월대비 증감) · 실현손익 모두 **완료·커밋됨**.
이번 세션: **R2 나머지(C·D·A·B) + 추가 보정(A버그·B+·C강화·C2) 전부 구현 완료 — 미커밋**. 다음: 화면 확인 → 커밋.

### 추가 보정 라운드 (사용자 피드백 반영, 미커밋)

| 코드 | 작업 | 핵심 |
|---|---|---|
| **A버그** | drill-down 클릭 안 됨 수정 | **recharts v3 onClick은 `activeTooltipIndex`(v2) 아니라 `activeIndex`**. + activeLabel fallback. Tooltip(D)은 v3에서도 정상이라 그것만 보였던 것 |
| **B+** | 월별 내역에 그달 잔액 | `AccountMonthlyFlow.balance` 추가(박제월=snapshot.balance, 이번달=현재). 프론트 월별내역 행에 잔액 메인+수입/지출 보조 |
| **C+** | 자동 박제 catch-up+upsert | `create_monthly_snapshots_for_all` 재작성. 최근 12개월 훑어 빠진 달 채움(catch-up) + 최근 2개월 upsert. **catch-up 하한 = `oldest_active_month`**(데이터 시작 전 달은 안 채움 — 검증으로 작년6~9월 안 생김 확인). `_build_and_save_snapshot(replace=)` + account_snapshot/portfolio repo `delete_for_household_month`(hard delete) |
| **C2** | 수동 박제 버튼 복구(upsert) | C에서 지웠던 수동 버튼 되살림. `create_target_month_snapshot` upsert 버전(has_active면 replace). 저장됨이어도 재클릭 가능(IconRefresh, "N월 갱신"). POST /create 복구 |

**정책 최종**: 자동(catch-up+upsert, 안전망) + 수동 버튼(지난달 upsert, 사용자 통제) **둘 다**. (사용자 메시지 기준 — AskUserQuestion '자동 단순' 답과 엇갈렸으나 마지막 메시지 우선)

**검증**: 자동 박제 실DB 롤백 테스트 통과 — 과거(10~3월) 보존 / 4월 upsert(현재잔액 최신화) / 5월 신규 / 데이터시작전 차단 모두 OK. 프론트 typecheck·eslint exit 0. 백엔드 전체 import OK.

## Status

### 이번 세션 완료 (미커밋, back+front)

| 코드 | 작업 | 핵심 |
|---|---|---|
| **C** | 수동 스냅샷 제거 | R1 자동박제로 불필요해진 `POST /account-snapshot/create` + 프론트 기록 버튼/모달/mutation 전부 제거. 데드 ErrorCode(SN001)도 삭제 |
| **D** | 총자산 추이 차트 직관화 | 추이 차트에 Tooltip(탭→그달 금액+전월대비%) + dot + "최근 N개월 +X%" 기간 요약 라벨 |
| **A** | 스냅샷 추이 drill-down | 차트 월 탭 → 계좌별 분해 패널(`snapshot-drilldown-panel.tsx` 신규). 프론트 타입에 monthly/total 흐름 필드 추가. **시드 7개월 실DB 커밋됨** |
| **B** | 계좌별 리포트 | 백 `GET /account/report/{id}`(박제 과거월 + 이번달 실시간 보강) + 프론트 리포트 섹션. 통장 상세를 **리포트 기본 / 수정은 `/account/[id]/edit` 분리** |

### 변경 파일

**백엔드** (household-back)
- `account/{router,schema,service}.py` — 리포트 API (`get_account_report`, `AccountReportResponse`, `AccountMonthlyFlow`, 날짜헬퍼 `_today_kst`/`_shift_months`)
- `account_snapshot/repository.py` — `find_by_account_and_range` 추가
- `account_snapshot/{router,service}.py` — 수동 박제(`create_target_month_snapshot`) 제거
- `core/exceptions/error_code.py` — SNAPSHOT_ALREADY_EXISTS 제거
- `portfolio/snapshot_service.py` — docstring 갱신
- `scripts/seed_snapshots_history.sql` — untracked (커밋 여부 미정)

**프론트** (household-front)
- `_features/account-snapshot/{api,types}.ts` + `queries/use-mutations.ts`(삭제) — 수동박제 제거 + monthly 필드
- `_features/account/{api,types}.ts` + `queries/{query-key,use-query}.ts` — 리포트 feature 4종
- `_sections/wealth/wealth-section.tsx` — 수동버튼 제거 + 차트 직관화 + drill-down 연결
- `_sections/wealth/components/snapshot-drilldown-panel.tsx` — 신규
- `_sections/account/account-report-section.tsx` — 신규
- `app/.../account/[accountId]/page.tsx`(→리포트) + `edit/page.tsx`(신규, 폼)

### 검증 완료
- 프론트: `pnpm typecheck` exit 0 / eslint(변경분) exit 0
- 백엔드: import 순환 없음 확인, `get_account_report` 실DB 직접 호출 OK
  (LIVING 통장: balance 31.7만, 이번달 5월 실시간 보강 income 10만/expense 29.9만 정상)
- 시드: 62cfbbe6 가계부 7개월(2025-10~2026-04) 톱니 우상향 실DB 커밋

## Context

### 중요 사실 (DB / 환경)
- **`data_stat_cd` ACTIVE = `'50'`** (enum DataStatus.ACTIVE). 직접 SQL 시 주의.
- 로컬 DB: docker `household-postgres`(127.0.0.1:5432), DB `HOUSEHOLD`, user `household`, pw `1234`.
  `DATABASE_URL=postgresql+asyncpg://household:1234@127.0.0.1:5432/HOUSEHOLD`
- 메인 가계부 `62cfbbe6-f3df-4aa2-8f30-eb9ec4dd8c58` ("우리 가족"), 계좌 10개.
- 파이썬: `.venv/bin/python` (uv, requires 3.14). ruff 미설치.
- 오늘 today_kst=2026-05-31.

### 설계 결정 (이번 세션)
- 계좌별 리포트 범위 = **월별 수입/지출 추이** (거래내역 리스트 아님 — 가벼움)
- 통장 상세 = **리포트 기본, 수정 분리** (`/account/[id]/edit`)
- D "직관화 대상" = **총자산 추이 차트** (자산 분포 아님)
- 날짜 헬퍼는 account_snapshot.service가 account.service를 import(순환) → account.service에 자체 정의

### 결정 이력 (이전)
- 부채/순자산 안 함, lot/cost basis 안 만듦(이동평균), 매매=가계부 지출/수입 아님(이중계상 금지).

## Next Step

1. **화면 확인** — `pnpm dev` 띄워서: 자산 탭 추이 차트(Tooltip/dot/월탭 분해) + 일반통장 진입 시 리포트 화면.
   - 주의: 시드의 4월 원본 monthly가 0이라 리포트 차트는 이번달(5월)만 막대 보일 수 있음. 추이(총자산)는 7개월 정상.
2. 화면 OK → 한글 커밋 (back/front 각각, dev 브랜치). scripts/ 시드 커밋 여부 결정.
3. (선택) 디자인 audit `/design-review`
4. R2 잔여 검토 — 청산종목 등은 R2 실현손익에서 이미 일부 커버. 추가 항목은 R3로.
