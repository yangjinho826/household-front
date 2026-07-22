# 진행 상태

## 완료
- [x] 2026-07-22: **반응형 UX 개선 — 작은 화면 CRUD 가려짐/발견성** (front 20파일, 미커밋). P1 매매 Drawer 탭바 가려짐 fix(FormSheet 일원화)+공통 FormActions sticky footer(8폼) / P2 추가 라벨버튼 6곳+툴바 칩 가로스크롤 / P3 금액 clamp·차트 툴팁 escape·터치타깃·도넛 1열·드릴다운 시트화. typecheck/lint + browse E2E(360·560·768·1280) 통과. 계획 ux-tranquil-truffle.md
- [x] 2026-06-03: **R5b 트랙② 디자인·브랜딩 + i18n 전건** (front, 13커밋). 로고 풀세트("모음" 마크=세 원 수렴, codex 시안검토 B안. `design/logo-20260603/`) + BrandLogo·favicon 새 마크. **favicon 500 픽스**(Next14 `app/icon.svg` 자동라우트 ↔ `metadata.icons.icon` /icon.svg 중복 충돌 → metadata 제거+app/icon.svg 정본화). **로딩 중앙정렬**(`<Center py=xl>` 높이없어 상단붙음 → PageLoader mih=70dvh 13곳). **i18n 하드코딩 124건 전건**(통화 useMoney ko원/en₩·단위·날짜 useMonthLabel·개별텍스트 9NS+wealth신설·메타 generateMetadata). 인프라(헬퍼+키) 메인 선작업 → 컴포넌트 치환 서브에이전트 병렬(json 충돌 회피). typecheck/lint/build + `/browse` `/en` 4페이지 E2E(UI 한글 0, 잔존=사용자데이터). 통화 정책 ko"1,000원"/en"₩1,000".
- [x] 2026-06-02: **거래 화면 리워크** (트랙② 시각, front+back, 미커밋). codex 디자인 리뷰 반영 v3: 헤더→MonthSummary(stats/monthly 수입·지출·저축률+지출카테고리 Top5 ratio바)→TransactionToolbar(세그먼트+타입칩+계좌Select 한 덩어리=codex Top1)→콘텐츠. 리스트/캘린더 IA 통일(Top2), 선택일 sage·radius·저축률음수 dimmed(Top3). 신규 month-summary/transaction-toolbar.tsx. 계좌필터=리스트 전용(calendarFull accountId 미지원). 백: transaction/repository 정렬 frst_reg_dt(같은날 입력순, id=uuid4라 무작위였음)+커서 3-tuple. typecheck/lint·실렌더(모바일/데스크톱/캘린더 5월) 검증. S6(카테고리 이관) 여기서 흡수.
- [x] 2026-06-02: **백엔드 정합 검증** — 직전 "R5a-1 미스매치" 기록은 오기록. household-back dev에 R5a-2/R5a-3/트랙①(자산성격폐지) 전부 커밋·push 확인(로컬=origin 0/0). wealth/service INVESTMENT 집계·enum STOCK부재·alembic head b2d3f4a5c6e7 정합.
- [x] 2026-06-02: **R5b 트랙② 구조 트랙 — 자산중심 IA 전면 재편** (front). S1 portfolio→invest 라우트 이동 / S2 레거시 308 리다이렉트 / S3 4탭화(홈·거래·투자·내정보)+nav i18n / S4 /wealth 슬림화(hero·도넛·계좌타입 진행바 제거+SubHeader, sub-route화) / S5 홈=자산 대시보드(TotalAssetHero 추출+wealth/home/portfolio 3쿼리 조합). S6(카테고리 이관) 스킵(stats.monthly 미검증·UX 복잡도). 결정: 차트=Mantine Charts, 브랜드="모음", IA=자산중심 4탭. /browse 로그인 QA 통과(3 API 200·콘솔 에러 0). dev push(ba8da2a). 시각 트랙(V1 design-shotgun~V5 리브랜딩) 대기. 로드맵 optimized-singing-russell.md
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
- [x] R5b 트랙②(디자인): 로그인·홈·거래·투자(메인+계좌상세+종목상세) 리워크 + 매매손익 종목→계좌 IA 이동 ← 2026-06-02 완료(front 4커밋 4ad6dd7·35c734e·035f274·dec28ab / back 3001c7e, dev 미push). 내정보·V5 리브랜딩 남음
- [ ] R5b+: TWR(시간가중수익률) / goal / 디자인 토큰화 ← TWR은 현금흐름 정의 필요, R5a 후

### R2+ 착수 전 확정할 결정
- 카드 사용일 vs 결제일 / 잔액조정(RECONCILIATION) tx / 투자계좌 예수금 모델 / 배당·이자 tx_type

## Follow-up (Low 우선순위)
- [x] cursor page 마다 `rowNo` 가 1부터 재시작 → 화면 미사용이라 타입+api 매핑에서 완전 제거
- [x] enum 응답 `as AccountType[]` 캐스트 → `isAccountType` 런타임 guard 로 교체 (CategoryType 캐스트는 코드에 없었음)
- [x] `useAccountList/useCategoryList/useFixedList` 미사용 데드 코드 → 삭제 (연쇄로 list queryKey 3개도 제거)

## 막힘
