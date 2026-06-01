# 진행 상태

## 완료
- [x] 2026-06-01: **R5a-3 (월별 배분추이) — 완료**. 설계 변경: 전용 테이블(원안) 폐기 → **방안 B 경량**(PortfolioValueHistory에 asset_class 컬럼 1개 + 조회시 AccountSnapshot 조합 on-the-fly 집계). 새 도메인/테이블 0개. 백: PVH 컬럼+마이그레이션 C(c9d4e7f21a36, 백필 UPDATE)+박제 기록+`build_allocation_trend`+schema(allocationTrend). 프론트: `allocation-trend-chart.tsx`(스택 AreaChart). 검증: 가역성·curl(trend==yearly·ratio100·cash 역산·이중계상0)·E2E 렌더 전부 통과. 핵심: 부동산/연금 과거 as-of = AccountSnapshot roll-up balance(평가이력 테이블 불필요). 상세 R5a-plan.md
- [x] 2026-06-01: R5a-2 (ManualAsset 부동산·연금) — 신규 manual_asset 도메인 + AccountType REAL_ESTATE/PENSION + roll-up + account_type→asset_class 매핑(double-counting 구조적 불가) + 마이그레이션 3ef71953bb00. 프론트 7파일(폼 modal) + wealth-section 섹션. dev 커밋 94452dd
- [x] 2026-06-01: R5a-1 (asset_class + 현재 배분 파이) — 2축 분리(market 유지+asset_class 신규). 백 8파일+마이그레이션 A(b8e4d1a09c37)+프론트 9파일. 배분 도넛(PortfolioDonut 재사용). codex 설계 검증. typecheck+9001 QA(allocation 합=totalBalance) 통과. dev 커밋 64d7571. 상세 R5a-plan.md
- [x] 2026-06-01: Follow-up 3건 정리 — 미사용 rowNo 필드(타입 7+api 매핑)·List 훅 3개·list queryKey 3개 데드코드 제거 + enum 응답 `as AccountType[]` 캐스트를 `isAccountType` 런타임 guard로 교체. typecheck 통과
- [x] 2026-05-31: 가계부×자산 통합 MVP 기획 — 코드현황+한/해외 벤치마킹+codex 교차검토. 부채/순자산·lot 제외, 총자산 기준으로 축소
- [x] 2026-05-31: R1 구현 — 매월 자동 박제 cron(back) + 전월대비 증감 표시(front). QA 통과, dev 커밋
- [x] 2026-05-31: R3 실현손익 — 매도 realized_pnl 박제 + 종목 상세 매매손익 탭. dev 커밋
- [x] 2026-06-01: R2 구현+QA 통과 — 추이 drill-down·계좌별 리포트·추이 차트 직관화. 시드(4월 부트스트랩 + 역산 8개월) 채워 화면 검증. dev 커밋
- [x] 2026-06-01: 설정파일 정리 커밋 — CLAUDE.md·.gitignore(.gstack/,시드)·settings (front dadb918 / back a3c9afb)
- [x] 2026-06-01: R4 구현+헤드리스 QA 통과 — 종목/투자계좌/일반통장 3화면 추이 차트(공통 ValueTrendChart). QA 중 버그 2개 fix: ①realized_pnl 마이그레이션 미적용(거래내역·매매손익 500) → alembic upgrade head ②종목 deep-link SSR 500(recharts) → useSyncExternalStore 마운트 가드. **미커밋(프론트 7파일)**
- [x] 2026-05-28: API 리팩토링 PR 0 — CursorPage 봉투 통일 인프라 + transaction 마이그레이션
- [x] 2026-05-28: API 리팩토링 PR 1 — portfolio overview/item/form-options 도입 + 무한 스크롤 거래내역
- [x] 2026-05-28: API 리팩토링 PR 2 — account / category / fixed 관리 페이지 무한 스크롤
- [x] 2026-05-28: API 리팩토링 PR 3 — home / wealth / settings overview 1호출 통합
- [x] 2026-05-28: API 리팩토링 PR 4 — transaction 캘린더/폼 1호출 통합
- [x] 2026-05-28: API 리팩토링 PR 5 — household / members CursorPage 봉투 통일
- [x] 2026-05-28: API 리팩토링 PR 6 — 정리 (ApiListResponse 삭제 / 데드 코드 / household 페이징 UI / deprecated calendar endpoint)
- [x] 2026-05-28: API 리팩토링 PR 7 — codex 외부 모델 교차 리뷰 반영 (High invalidation 버그 fix + Med 4건)

## 진행 중
- [ ] dev → main 머지 (R1~R5a 전부 main 미반영) — **R5a 사이클 완료, 머지 검토 시점**

## 가계부×자산 통합 — MVP 로드맵 (R1 완료, R2~ 대기)

목적: "매월 자산이 어떻게 변하는지 한눈에"(총자산 기준). 부채/순자산·lot 안 함.
원칙(codex): 데이터모델→적재→표현, immutable 스냅샷, 이중계상 금지.

- [x] R1: 자동 박제(월1일 cron) + 전월대비 증감 ← 완료(dev 커밋)
- [x] R2: 추이 drill-down + 계좌별 월간 리포트 + 추이 차트 직관화 ← 완료(dev 커밋, QA 통과)
- [x] R3: 실현손익 박제 + 종목 매매손익 탭 ← 완료(dev 커밋). 청산종목 전용 화면은 R4+로
- [x] R4: 월별 추이 라인차트 3화면(공통 ValueTrendChart) ← 완료(dev 커밋 1c567b7)
- [x] R5a: asset_class 배분 + ManualAsset(부동산·연금) + 월별 배분추이 ← **R5a-1/2/3 전부 완료(dev 커밋)**. 상세 R5a-plan.md
- [ ] R5b+: TWR(시간가중수익률) / goal / 디자인 토큰화 ← TWR은 현금흐름 정의 필요, R5a 후

### R2+ 착수 전 확정할 결정
- 카드 사용일 vs 결제일 / 잔액조정(RECONCILIATION) tx / 투자계좌 예수금 모델 / 배당·이자 tx_type

## Follow-up (Low 우선순위)
- [x] cursor page 마다 `rowNo` 가 1부터 재시작 → 화면 미사용이라 타입+api 매핑에서 완전 제거
- [x] enum 응답 `as AccountType[]` 캐스트 → `isAccountType` 런타임 guard 로 교체 (CategoryType 캐스트는 코드에 없었음)
- [x] `useAccountList/useCategoryList/useFixedList` 미사용 데드 코드 → 삭제 (연쇄로 list queryKey 3개도 제거)

## 막힘
