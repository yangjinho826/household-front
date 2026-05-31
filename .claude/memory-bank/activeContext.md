# 활성 컨텍스트

## Goal

**가계부 × 자산 통합 — 월별 자산변동 추적** 기능 구축.
핵심 목적: "매월 내 자산이 어떻게 변하는지 한눈에" (총자산 기준, 부채/순자산은 안 함 — 사용자 결정).

**R1 = 자동 박제 + 전월대비 증감** 구현 완료. 코드 검증·QA까지 끝. 미커밋 상태.
다음: 시드 데이터로 화면 확인 → 커밋 → (선택) 디자인 audit.

## Status

### R1 구현 완료 (미커밋)

**백엔드 (household-back) — 매월 자동 박제**

| 파일 | 변경 |
|---|---|
| `app/core/jobs.py` | `create_monthly_snapshots_job` 추가 (run_locked_job advisory lock) |
| `app/core/scheduler.py` | 매월 1일 00:30 KST cron 등록 (잡 5개로) |
| `app/domain/account_snapshot/service.py` | `_target_month()`, `_build_and_save_snapshot()` 분리 + `create_monthly_snapshots_for_all()` 추가. 빈 가계부(계좌0개) skip 처리 |
| `app/domain/household/repository.py` | `find_all_active()` 추가 (배치용) |

**프론트 (household-front)**

| 파일 | 변경 |
|---|---|
| `src/_sections/wealth/wealth-section.tsx` | 총자산 밑에 "N월 기록 대비 +X원 (+Y%)" 증감 표시. 증가=linerGreen.6 / 감소=danger.5 |

### 검증 완료

- 백엔드: 로컬 실DB(HOUSEHOLD)에서 `create_monthly_snapshots_for_all` 실제 실행 →
  4가계부 / 계좌12개 4월(2026-04) 박제됨. 종목 평가액 박제(portfolio_value_history) 8건 동시 실행 ✅
- **QA 중 버그 1건 발견·수정**: 계좌0개 가계부가 매번 신규 박제로 카운트되던 문제 → skip
- 멱등 재검증: 재실행 created=0, 중복 0 ✅
- 프론트: `pnpm typecheck` exit 0 / `eslint --max-warnings=0` exit 0 ✅

## Context

### 중요 사실 (DB / 환경)

- **`data_stat_cd` ACTIVE = `'50'`** (문자열 'ACTIVE' 아님! enum DataStatus.ACTIVE). 직접 SQL 쿼리 시 주의.
- 로컬 DB: docker `household-postgres` (127.0.0.1:5432), DB명 `HOUSEHOLD`, user `household`.
  - 실데이터: households 4 / accounts 12 / transactions 22 / portfolio_items 8.
  - **account_snapshots: QA로 4월(2026-04) 12행 실제 커밋됨** (롤백 안 함, 실박제).
- 계좌 10개짜리 가계부 = `62cfbbe6-f3df-4aa2-8f30-eb9ec4dd8c58` (화면 확인용 메인).
- 백엔드 토큰: `create_access_token(dict)` — dict 받음. `{"sub": str(user.id), "language": ...}`.
  household 컨텍스트는 `X-Household-Id` 헤더.
- 오늘 기준 today_kst=2026-05-31, target_month=2026-04-01.

### 결정 이력 (이번 기획)

- 부채/순자산 **안 함** — 총자산(계좌 balance 합)만. (복잡도 줄이려고 사용자가 결정)
- lot/cost basis **안 만듦** — 이동평균 유지 (codex 권고).
- 디자인 audit는 R1 화면 확정 후 별도로 (R1에 미포함).
- 실현손익/청산종목/계좌별 리포트/drill-down = R2 이후로 미룸.

### 기획 근거

코드베이스 현황 파악 + 한/해외 앱 벤치마킹(뱅샐·토스·Monarch·YNAB 등) + codex(gpt-5.1-codex-max) 교차검토 거침.
원래 MVP 4개(계좌별 리포트/스냅샷 자동화+drill-down/실현손익·청산/통합 대시보드)에서 **R1으로 축소**:
자동 박제 + 전월대비 증감만. codex 핵심교훈: 데이터모델→적재→표현 순서, 이중계상 금지(매매는 가계부 지출/수입 아님 — 현행 코드 이미 올바름 account/service.py:46-70).

## Next Step

1. **시드 데이터로 화면 확인** — 62cfbbe6 가계부에 과거 6개월치(2025-10~2026-03) account_snapshot 추가해서 추이 차트+증감 둘 다 보이게. (작성하던 `_seed_snapshots.py` 있었으나 삭제함 — 다시 만들면 됨. 4월 박제값에 ratio 0.82~0.96 곱해 역산하는 방식)
2. 화면 확인 후 → 한글 커밋 (back/front 각각, main 아니니 브랜치부터)
3. (선택) 디자인 audit /design-review
4. R2 검토 (계좌별 리포트 / 실현손익 등)

### 주의 (이번 세션 시행착오)

- Bash 인라인 파이썬을 너무 길게/여러 개 엮으면 멈춘 것처럼 느려짐. 짧게 끊어서.
- 토큰 테스트 시 `create_access_token`에 uid만 넘기면 빈 응답 (dict 필요).
