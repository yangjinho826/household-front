# 활성 컨텍스트

## Goal

**가계부 × 자산 통합 — 월별 자산변동 추적**.
"매월 내 자산이 어떻게 변하는지 한눈에" (총자산 기준, 부채/순자산 안 함).

## Status

R1(자동박제+전월대비) · R2(추이 drill-down·계좌 리포트·차트 직관화) · R3(실현손익) · R4(추이 차트) 전부 **dev 커밋 완료** (front b5a083c / back a3c9afb 까지). dev→main 머지만 남음.

이번 세션: **Follow-up Low 3건 전부 정리** — 데드코드 제거(미사용 rowNo 필드·List 훅 3개·list queryKey 3개) + enum `as AccountType[]` 캐스트를 `isAccountType` 런타임 guard 로 교체. typecheck 통과, 미커밋.

직전 세션: R4 구현 + 헤드리스 QA 통과 + 버그 2개 fix (아래 Context).
- R4 = 3개 화면에 월별 추이 라인차트 (공통 `ValueTrendChart` 1개 공유, drill-down/표 없이 차트만):
  - 종목 상세 → 평가액(valuation) 추이 (`usePortfolioValueHistoryByItem`)
  - 투자계좌 상세 → 통장 전체 자산(balance) 추이 (`useAccountSnapshotYearly` 재활용, hero와 일치)
  - 일반통장 상세 → 잔액 추이 (`account-report-section` 월별 내역 **표를 차트로 교체**)
- QA 중 버그 2개 발견·수정 (아래 Context).

## Context

- **버그①: 거래내역 빈 표시 + 매매손익 예외** — R3 마이그레이션(`a3f7c9d2e1b8`, `portfolio_transactions.realized_pnl/realized_cost_basis`)이 **이 로컬 DB에 미적용**. `select(PortfolioTransaction)` 이 없는 컬럼 참조 → 500. 거래내역은 `useInfiniteQuery` 라 빈 상태로 삼키고, 매매손익은 `useSuspenseQuery` 라 예외로 터짐. → `uv run alembic upgrade head` 로 해결. (운영 배포는 deploy.yml 에서 alembic 돌아 무관)
- **버그②: 종목 상세 deep-link/새로고침 500** — 내 추이 차트(recharts `ResponsiveContainer`)가 SSR prerender 에서 `useContext` null. 종목 페이지엔 `useInfiniteQuery` 가 같이 있어 트리거. → `ValueTrendChart` 에 `useSyncExternalStore` 마운트 가드(서버 false/클라 true)로 클라에서만 렌더. 일반통장은 원래 BarChart 가 있어 안 터졌음.
- **종목 추이 시드**: `portfolio_value_history` 가 4월 1개월뿐이라 종목 차트가 숨김(2개월 미만) → 4월 박제 기준 2025-10~2026-05 톱니 우상향 역산 INSERT(88 row, 로컬 전용). account_snapshots 는 R2 시드로 이미 8개월.
- **로컬 QA 인증**: 헤드리스 browse 가 DPAPI(브라우저 실행중 쿠키 잠금)로 쿠키 import 실패 → 로그인 폼 자동입력 또는 `POST /api/auth/login` 으로 토큰 받아 curl. 백엔드는 Bearer 헤더 + `X-Household-Id` 헤더 인증.
- 환경: 백 9000(`uv run uvicorn app.main:app --reload --port 9000`), 프론트 3000, DB docker `household-postgres`(household/1234/HOUSEHOLD). 계정 yangjinho826@naver.com. KIWOOM household=`62cfbbe6`, ISA통장=`4a815cc7`, KIWOOM종목=`4d2fe152`.
- recharts **3.8.1 (v3)**.

## Next Step

1. **커밋** — R4 프론트 7파일 (한글 conventional). 마이그레이션은 코드변경 아님(DB만).
2. **dev → main 머지** — R1~R4 전부 main 미반영.
3. **R5+** — asset_class 배분 / goal / TWR / 부동산·연금 / 디자인 토큰화.
