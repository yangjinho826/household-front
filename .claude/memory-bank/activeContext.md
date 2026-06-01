# 활성 컨텍스트

## Goal

**가계부 × 자산 통합 — 월별 자산변동 추적**.
"매월 내 자산이 어떻게 변하는지 한눈에" (총자산 기준, 부채/순자산 안 함).

현재 사이클: **R5a — 자산성격(asset_class) 배분 + 부동산·연금(ManualAsset) + 월별 배분추이**.

## Status

R1~R4 전부 dev 커밋 완료. **dev→main 머지는 아직 안 함**.
- ✅ **R5a-1 (asset_class + 현재 배분 파이) — 커밋 완료** (front `64d7571` + `a374797`).
- ✅ **R5a-2 (ManualAsset 부동산·연금) — 완료, 아직 미커밋**.
  - 백: 신규 `manual_asset` 도메인 5파일 + `AccountType`에 REAL_ESTATE/PENSION + `_calc_balance` roll-up 분기 + `_build_allocation` account_type→asset_class 매핑 + main.py + 마이그레이션 `3ef71953bb00`.
  - 프론트: `_features/manual-asset/` 7파일 + `account/types`·`account/constants`·`_constants/queries` + `wealth-section` 부동산·연금 섹션 + i18n(ko/en).
  - 검증: 마이그레이션 가역성 OK · typecheck/lint 통과 · curl(부동산 5억→총자산 정확히 증가, REAL_ESTATE 슬라이스 등장, double-counting 없음, 삭제 원복). 화면용 샘플(부동산 6.2억/연금 4800만) 등록해둠.
- ⬜ **R5a-3 (스냅샷 통합 + 월별 배분추이)** — 다음.

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

1. **R5a-3 착수** — asset_class_snapshots + 월별 배분추이 (`R5a-plan.md` R5a-3 섹션). 그 후 dev→main 머지 검토.

> 금/채권ETF asset_class 재분류는 작업 항목에서 제외 — 데이터 라벨링(SQL 추측 금지 원칙)이라 사용자가 폼에서 직접. R5a-3 직전에 한 번 정리하면 추이가 더 정확해지는 정도(선택).
