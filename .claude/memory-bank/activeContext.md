# 활성 컨텍스트

## Goal

**가계부 × 자산 통합 — 월별 자산변동 추적**.
"매월 내 자산이 어떻게 변하는지 한눈에" (총자산 기준, 부채/순자산 안 함).

현재 사이클: **R5a — 자산성격(asset_class) 배분 + 부동산·연금(ManualAsset) + 월별 배분추이**.

## Status

R1~R5a 전부 dev 커밋 완료. **dev→main 머지는 아직 안 함** — R5a 사이클 끝났으니 머지 검토 시점.
- ✅ **R5a-1 (asset_class + 현재 배분 파이)** — front `64d7571`.
- ✅ **R5a-2 (ManualAsset 부동산·연금)** — `94452dd`. manual_asset 도메인 + REAL_ESTATE/PENSION roll-up + double-counting 구조적 불가.
- ✅ **R5a-3 (월별 배분추이) — 완료·커밋**.
  - **설계 변경**: 전용 `asset_class_snapshots` 테이블(원안) 폐기 → **방안 B 경량**. PortfolioValueHistory에 `asset_class` 컬럼 1개 추가 + 조회 시점 AccountSnapshot+PVH 조합 on-the-fly 집계. 새 도메인/테이블 0개.
  - 백: PVH 컬럼+마이그레이션 `c9d4e7f21a36`(백필 UPDATE)+박제 기록(snapshot_service)+`build_allocation_trend`(wealth/service)+schema `allocationTrend`+`resolve_snapshot_range` 헬퍼 추출.
  - 프론트: `allocation-trend-chart.tsx`(useMounted SSR 가드+스택 AreaChart+0패딩) + types `AllocationTrendPoint` + wealth-section 부착. api.ts/i18n 수정 불필요(타입 참조·기존 enum 키 재사용).
  - 검증: 가역성 왕복 · curl(모든 월 trend==yearly·ratio100·cash 역산·이중계상0·수동박제 후 5월 부동산/연금 반영) · **E2E 렌더(5개 자산군 스택, 색상·툴팁)** 전부 통과.

### R5a-3 핵심 통찰 (재작업 방지)
- 부동산/연금 과거 as-of = **AccountSnapshot의 REAL_ESTATE/PENSION 계좌 roll-up balance**(매달 박제됨) → ManualAsset 평가이력 테이블 불필요(R5a-2에서 미룬 것 끝내 안 만듦).
- INVESTMENT 과거 cash = `AccountSnapshot.balance − Σ그달 PVH.valuation` (`_calc_balance` balance=cash+valuation 역산, 같은 시점·공식이라 등식 성립).
- PVH에 asset_class 박제 → 종목 재분류돼도 과거 배분추이 박제값 유지(codex "aggregation loss" 해소).

## Context

- 이 컴퓨터: 백 **8000**(--reload), 프론트 **3000**, DB head = `3ef71953bb00`. 계정 yangjinho826@naver.com / wlsghdid2@ / household=`62cfbbe6-...`. 인증 = Bearer + `X-Household-Id` 헤더.
- **로컬 DB는 항상 `alembic upgrade head` 선행** (드리프트 시 배분/거래 조용히 500 — R5a-1 QA 때 실제 발생).
- **배분 정합 핵심**: 부동산/연금은 전용계좌(REAL_ESTATE/PENSION AccountType)로 roll-up. `_build_allocation`이 account_type→asset_class 매핑(전용계좌 balance를 해당 슬라이스로). ManualAsset 따로 합산 X → double-counting 구조적 불가.
- **전용계좌 lazy 생성** (가계부당 부동산 1/연금 1, `_ensure_rollup_account`).
- **평가이력 테이블(manual_asset_valuations)은 R5a-2에서 안 만듦** — 현재값만(`manual_assets` 단일). 과거 평가액 carry-forward는 R5a-3에서.
- 미해결: 금/채권ETF가 아직 `asset_class=STOCK`(마이그레이션 기본값). 사용자가 폼에서 COMMODITY/BOND 재분류 필요.
- 프론트 실제 스택 = Mantine + query-key-factory + tabler + 언더스코어 디렉토리.
- **provider 순서 함정**(base-layout.tsx): `NextIntl > Mantine(+Modals) > QueryProvider`. → `modals.open()` portal 컴포넌트는 **QueryClientProvider 밖**이라 useQuery/useMutation 하면 "No QueryClient set" 런타임 에러. 쿼리 쓰는 폼은 트리 내 `<Modal>`로 직접 렌더하거나 페이지로. (manual-asset 폼은 `<Modal>` 직접 렌더 — 브라우저 QA에서 발견·수정). typecheck/lint/curl 다 통과해도 못 잡는 에러 → 렌더 검증 필수.

## Next Step

1. **dev→main 머지 검토** — R1~R5a 전부 dev에 있고 main 미반영. front/back 두 레포.
2. (선택) R5b+ — TWR / goal / 디자인 토큰화.

> 금/채권ETF asset_class 재분류는 데이터 라벨링(SQL 추측 금지)이라 사용자가 폼에서 직접. 재분류하면 추이 STOCK→COMMODITY/BOND 분리가 다음 박제부터 반영(PVH는 박제 시점값 동결).
