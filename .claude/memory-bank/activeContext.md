# 활성 컨텍스트

## Goal

**가계부 × 자산 통합 — 월별 자산변동 추적**.
"매월 내 자산이 어떻게 변하는지 한눈에" (총자산 기준, 부채/순자산 안 함).

현재 사이클: **R5b — 3트랙 (① 자산성격 제거 ② 디자인·브랜딩 ③ 수익률·목표)**. 로드맵 = `~/.claude/plans/tranquil-seeking-meadow.md`.
이전 사이클: R5a (자산성격 배분 + ManualAsset + 월별 배분추이) — 완료.

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

## R5b 진행

- ✅ **트랙 ① 자산성격 제거 + 금/실물 수동자산 편입** (front+back, 커밋·push 완료).
  - 종목 `asset_class` 폐지 → 종목 전체 = `INVESTMENT` 한 슬라이스. `AssetClass` enum에서 STOCK/BOND 제거.
  - 금/실물은 ManualAsset에 `COMMODITY` 추가(REAL_ESTATE/PENSION과 동일 전용계좌 roll-up). `AccountType.COMMODITY` 신설.
  - 백: portfolio model(2컬럼 DROP)/schema/service/snapshot, wealth/service(INVESTMENT 합산+COMMODITY 분기), manual_asset, account/enum. **account/service.py `_calc_balance` COMMODITY 분기 추가**(검증 중 누락 발견 — 안 하면 금 계좌 balance 0). 마이그레이션 M1 `a1c2e3f4b5d6`(portfolio_items), M2 `b2d3f4a5c6e7`(PVH) — **head=b2d3f4a5c6e7, 가역성 왕복 검증됨**.
  - 프론트: portfolio types/constants/form/use-form, manual-asset, account types/constants, wealth-section, ko/en.json.
  - 검증: 마이그레이션 왕복 · typecheck · curl(배분합==총자산 771,377,260·이중계상0·STOCK/BOND부재·INVESTMENT등장·추이 INVESTMENT합산) · **금 COMMODITY 등록 E2E(등록→계좌 lazy생성→balance roll-up→배분 COMMODITY 슬라이스→삭제 원상복구, 모두 통과)**. 미검증: 브라우저 시각 렌더(타입·데이터로 안전 담보).
  - ⚠️ 빈 "금·원자재" COMMODITY 계좌(balance 0)가 검증 중 lazy 생성되어 DB 잔존 — 무해(필터 제외, 진짜 금 등록 시 재사용).
- ❌ **트랙 ③ 수익률(TWR) + 자산군별 목표(goal)** — 구현했다가 **사용자 판단으로 전체 롤백**("월별 배분추이까지가 딱 좋다, 과하다", 2026-06-01). DB head c3e5a7b9d1f2→b2d3f4a5c6e7 downgrade, goal 도메인/마이그레이션/`_features/goal`/twr-trend-chart 삭제, wealth service/schema/types/api·wealth-section·main.py·queries.ts에서 TWR/goal 부분 제거. typecheck·curl(wealth twr 필드 없음·goal 404) 확인. **트랙①은 유지**(자산성격 제거 — 사용자가 원했던 단순화).
- 🔄 **트랙 ② 디자인 전면 개편** — 로드맵 `~/.claude/plans/optimized-singing-russell.md`. (사용자가 토큰화→**전면 개편**으로 확대: IA 재편+레이아웃+차트+리브랜딩)
  - 결정: 차트=**Mantine Charts**(@mantine/charts), 브랜드명=**모음**(한글), IA=**자산중심 4탭**, 시각=**design-shotgun 시안**.
  - ✅ **구조 트랙 S1~S5 완료·dev push(ba8da2a)**: S1 portfolio→invest 라우트 이동 / S2 레거시 308 리다이렉트(middleware.ts) / S3 4탭화(홈·거래·투자·내정보)+nav i18n / S4 /wealth 슬림화(hero·도넛·계좌타입 진행바 제거+SubHeader, sub-route화) / S5 홈=자산 대시보드(`TotalAssetHero` 추출 + wealth/home/portfolio 3쿼리 조합: 총자산 hero·자산군 도넛·투자손익·가계부 요약·최근거래). S6(카테고리 이관) 스킵(stats.monthly 엔드포인트 미검증).
  - QA: /browse 로그인 → 홈/자산/투자 전 화면 렌더 + 3 API(home/wealth/portfolio overview) 200 + 콘솔 에러 0(recharts width warning만 — V4서 h prop으로 해소).
  - 🔄 **시각 트랙 진행**: ✅V1 무드 선택 완료 → V2 DESIGN.md(design-consultation) → V3 토큰화(하드코딩 hex 10~15군데 정리) → V4 차트 Mantine Charts 교체 → V5 리브랜딩("가계부"→"모음": layout/manifest/i18n/brand-logo).
  - ✅ **V1 완료(2026-06-02)**: design-shotgun이 OpenAI 키 없어 AI 이미지 불가 → **HTML 코드 목업 폴백**으로 홈 대시보드 3무드(A Clean Slate 토스풍 / B Midnight Vault 다크 / C Warm Ledger 따뜻) 비교보드 생성. **사용자 선택 = C · Warm Ledger**. 토큰: bg #FAF6EF / card #FFFDF9 / primary 세이지 #7C9473 / accent 테라코타 #D98E73 / text #3C3530 / 세리프 헤드라인 / 24px 라운드. 상세=`~/.gstack/projects/yangjinho826-household-front/designs/home-dashboard-20260602/approved.json` + board.html.
  - ✅ **V2 완료(2026-06-02)**: `DESIGN.md`(프로젝트 루트) 작성 + **codex 교차 검토 반영**. Warm Ledger 디자인 시스템 명세. 최종 확정:
    - **세리프 = 브랜드 로고("모음")만**(codex가 한글 세리프 이질감/로딩으로 축소 권고 — 섹션타이틀도 Pretendard). h1만 선택적.
    - **의미색**: 수입 파랑·지출 빨강 유지 + **초록 역할 분리** → `sage`(브랜드/액션) vs **`positive` #2F855A(양수·수익)**. 기존 `linerGreen` #22C55E 폐기→positive 치환(7곳+: total-asset-hero·value/account/portfolio-trend·snapshot-drilldown·account-report·account constants SAVINGS).
    - primary=세이지, **primaryShade light 5→6**(#647A5C — 대비 3.34→4.73 AA). accent=테라코타(shade4 #E5B197로 벌림). gray=웜그레이 교체, **textDim gray.5→6 #7A6F63**(대비). 카드 radius xl→3xl(이미 토큰 존재), defaultRadius는 유지(전역 영향 방지). 갈색톤 그림자.
    - **8장 = V3 작업 명세서**(mantineTheme.ts 변경표 + 8-3 linerGreen→positive 치환 파일목록 + design-tokens.ts TOKEN). primary 사용규칙: "수입은 반드시 c=info 명시".
    - 검토 경로: design-consultation 스킬은 프리뷰가 OpenAI 키 필요라 스킵→직접 작성, **codex exec로 교차 검토**(codex CLU 0.134 인증OK). 사용자: design 이미지용 OpenAI 키는 효용 낮은 단계라 안 만듦.
  - ✅ **V3 토큰화 완료·커밋(2026-06-02, dev 미push)**: 커밋 099e466(DESIGN.md)·e597f09(토큰)·d0aff98(작업기록). mantineTheme(sage/terracotta/positive tuple, gray 웜그레이, primaryColor info→sage shade6, 갈색그림자, Card 3xl) + design-tokens TOKEN(green→positive) + 사용처(linerGreen→positive 8곳, TOKEN.green→positive 3곳, brand-logo sage) + globals.css 배경 #f2f4f6→크림 #faf6ef. typecheck/lint 통과, 로그인 화면 렌더로 sage/웜그레이 확인.

  - 🔀 **방향 전환 → "화면별 레이아웃 리워크"** (2026-06-02): 사용자가 V3 후 "화면이 예전과 똑같다"(색만 바뀜). **오해 정리**: gstack 디자인 스킬(design-shotgun/consultation/review)은 전 화면 자동 재디자인 도구 아님 — 무드 시안+명세+QA고 레이아웃 코드는 내가 짜야 함. 사용자 기대=로그인부터 전 화면 디자이너 패스. **경로 B 선택**(OpenAI 키 없이 내가 직접 리워크 + HTML 목업 미리보기. Gemini는 design 바이너리가 OpenAI 전용이라 불가).
  - 🔄 **로그인 화면 리워크 진행 중 (V4 차트 전에 끼어듦)**:
    - codex 검토 완료 → **A안(중앙 미니멀) 채택 + B(브랜드강조) 따뜻한 카피만 흡수**. 보완: 완전중앙말고 상단45% 보정중앙(키보드), 약관카피는 실제 링크없으니 제거, 세리프 워드마크 1회만, pill 버튼 OK.
    - **미커밋 적용분 3파일**: `base-layout.tsx`(Noto Serif KR CDN link 추가) / `globals.css`(`.brand-wordmark` 세리프 클래스) / `(guest)/layout.tsx`(bg white→크림 #FAF6EF + flex 수직중앙).
    - **남은 작업**: ① `login-section.tsx` A안 리워크(브랜드블록=BrandLogo+"모음" 세리프 워드마크(className brand-wordmark)+캐치프레이즈 / 입력 / pill 버튼 / 회원가입·약관 주석블록 제거) ② i18n `auth.brand_name`("모음")·`auth.brand_tagline`("매달 내 자산이 어떻게 변하는지" 류) ko/en 추가 ③ typecheck ④ dev 재시작 후 browse 시각확인.
    - **아이콘 결정 = D(전용 로고)**: 사용자가 Recraft.ai(SVG 무료) 또는 크몽/디자이너로 "모음" 로고 제작 → 받으면 내가 `public/icon.svg`·192/512·apple-touch + `brand-logo.tsx`(현재 tabler IconWallet placeholder) + `manifest.json` 교체. 로고는 로그인 레이아웃과 독립(자리만 잡아둠).
    - **반응형**: 로그인=(guest) `Container size=448` 고정중앙이라 데스크톱/태블릿/폰 거의 동일(폰 목업=데스크톱). **(user) 화면(홈 등)은 데스크톱서 user-shell-wrap 사이드바+메인 2단**이라 홈 리워크 때 3뷰포트 별도 설계 필수.
    - **환경 주의**: dev 서버 워커 크래시 빈발("Jest worker exceeding retry limit" — 재시작 필요). 백엔드 8000 DOWN → 홈/자산/투자는 force-dynamic이라 백엔드 없으면 500(로그인=(guest)는 백엔드 불필요).
  - ✅ **로그인 화면 리워크 완료(2026-06-02, dev 미커밋) — 개선 B 채택**: 처음 A안(중앙 미니멀)으로 구현했다가 **사용자가 로그인 보드(login-redesign-20260602/board.html) 3번째=개선 B로 변경 요청**("시안 3번/C로"). 보드는 [현재]·[개선 A 중앙미니멀]·[개선 B 브랜드강조+카드시트] 3컬럼(C 라벨 없음, 3번째=B).
    - **개선 B 구조**: (guest)layout = Container 448 + px0 + 상단 따뜻한 그라데이션(`linear-gradient(180deg,#F3E6DA 0%,#FAF6EF 38%)`) + flex column. login-section = hero(좌정렬 BrandLogo 64 + "모음" 세리프 40px brand-wordmark + 태그라인 keep-all, padding 64/28/32) + 하단 카드 시트(marginTop auto·TOKEN.card·radius 28 28 0 0·위로 그림자·padding 30/26/40) 안에 입력+pill 버튼. form flex:1.
    - i18n `auth.brand_name`("모음"/"Moeum")·`auth.brand_tagline`("매달 내 자산이 어떻게 변하는지 한눈에 모아봐요" — B 따뜻한 카피) ko/en + brand-logo aria-label "가계부"→"모음".
    - typecheck 통과 + **browse 시각확인(390 모바일 + 448 박스, 콘솔 에러 0, 그라데이션·세리프 명조 로드·카드시트·pill 의도대로)**. Noto Serif KR `notoLoaded:true` js 확인.
    - 미커밋 3파일(base-layout Noto Serif link / globals.css .brand-wordmark)도 그대로 미커밋. (guest)layout은 B로 재수정됨.
    - ⚠️ 미검증: 로그인 **실패 토스트** 동작(백엔드 8000 DOWN이라 로그인 시도 불가). 새로고침 제거는 코드레벨 확실.
  - 🐛 **보너스 버그 fix(2026-06-02)**: 로그인 실패 시 페이지 새로고침되던 것 = `return-fetch-refresh.ts`가 로그인 401을 "세션만료"로 오인→refresh 시도 실패→`redirectToLogin()`의 `location.replace`로 리로드. 응답 인터셉터 체인이 안쪽부터(refresh가 api보다 먼저 401 가로챔)라 onLoginError 토스트 도달조차 못 함. **수정**: `isAuthEndpoint`(login/logout/refresh) 401은 refresh 스킵→api가 ApiResponseError throw→onLoginError 토스트. 사용자: 토스트 방식 유지 결정.
  - ✅ **홈 화면 리워크 완료(2026-06-02, 커밋)** — 무드 C(Warm Ledger) 확정 후 **B 압축 레이아웃** 구현: hero → 자산도넛+투자 2열 그리드 → 가계부 → 최근거래. 추이차트/자산군도넛/FAB 색 Warm(sage/terracotta)로 통일, theme-color #3B82F6→sage. 자산분해 인라인펼침 → **중앙 모달**(Mantine Modal). 홈 멘트 전부 i18n(`home` 네임스페이스 38키 ko/en, "원"·월라벨·평가손익·모달·FAB aria까지). **QuickAddFab(+버튼) 제거**(콘텐츠 가림+팝업 점프 불만), user-shell paddingBottom·데스크톱 --bottom-tab-h:0·scrollbar-gutter:stable 정리. PortfolioDonut 세로모드 추가. (목업=`~/.gstack/.../home-dashboard-20260602/board-layout.html`)
  - ✅ **백엔드 정합 검증 완료(2026-06-02) — 직전 "R5a-1 미스매치" 기록은 오기록이었음**: `household-back` dev HEAD = `5ce324d`(머지), R5a-2(`b0c9687`)·R5a-3(`93173bf`)·트랙①(`2c50bb8`) **전부 커밋·push 돼 있음**(로컬=origin/dev 0/0). 직전 세션이 멈췄다고 본 `63d90a6` 위로 4커밋 더 살아있음. 검증: `wealth/service.py:78` 은 `item.asset_class` 안 쓰고 무조건 `AssetClass.INVESTMENT` 합산 / enum 에 STOCK 없음(INVESTMENT/COMMODITY/CASH/REAL_ESTATE/PENSION/OTHER) / PortfolioItem 모델 asset_class 폐지 / alembic 단일 head `b2d3f4a5c6e7`(asset_class add→drop 전체 여정). `radiant-cooking-key.md` 백엔드 재구현 계획은 **불필요**(작업 이미 완료). ⚠️ 런타임(8000 띄운 실제 응답)은 미검증 — 정적 검증만.
  - ✅ **거래 화면 리워크 완료(2026-06-02, 미커밋) — codex 리뷰 반영 v3**: 목업 3차(`~/.gstack/.../transactions-rework-20260602/board.html`) → codex 디자인 리뷰 → 구현+실렌더 검증. **구조**: 헤더(Title+MonthPicker+추가FAB) → **MonthSummary**(stats/monthly: 수입·지출·저축률 + 지출카테고리 Top5 ratio 바, 리스트/캘린더 공통상단) → **TransactionToolbar**(세그먼트+타입칩+계좌Select 한 카드 = codex Top1 "동동 뜬 세그먼트" 해소) → 콘텐츠. codex Top2(리스트/캘린더 IA 통일=캘린더에도 요약), Top3(선택일 info→sage, radius 14px, 저축률 음수=dimmed) 반영. 신규 파일=`_sections/transactions/components/{month-summary,transaction-toolbar}.tsx`. **계좌필터=리스트뷰 전용**(calendarFull API 가 일별합계까지 묶여 accountId 미지원 — 캘린더는 보류). **백엔드**(household-back, 미커밋): `transaction/repository.py` 정렬 `id.desc()`→`tx_date,frst_reg_dt,id desc`(id=uuid4라 같은날 무작위였음→입력순=frst_reg_dt) + 커서 2-tuple→3-tuple, `service.py` next_cursor 동일. 검증: front typecheck/lint·back 커서로직·실렌더(모바일/데스크톱 리스트+캘린더 5월데이터, 콘솔에러 0). i18n `transaction.summary_*`/`filter_all_accounts` ko/en. ⚠️ 무관 이슈: 로그인직후 홈(/ko) 400 1건(거래와 무관, 미조사).
    - **피드백 3건 보정(2026-06-02, 미커밋)**: ① month-summary 카테고리 섹션 빈 달에도 유지+"지출 0원"(`summary_no_expense`) ② calendar-view 우측 "선택일 거래" 라벨을 카드 내부 헤더로 이동→좌측 달력 카드와 박스 크기/상단 정렬 일치(라벨이 카드 밖이라 어긋났던 것) ③ **모바일 날짜피커 가림 fix**: quick-add-sheet(바텀 Drawer) 안 DateInput popover가 컨테이너에 잘림 → mantineTheme `DateInput.defaultProps.popoverProps={withinPortal:true,zIndex:1100}` 전역(거래추가+포트폴리오매매폼 공통 해결). DateInput 은 `dropdownType` prop 없음(DatePickerInput 전용)이라 popoverProps 로. typecheck/lint·실렌더(6월 0원·5월 캘린더 박스·날짜피커 달력 온전) 검증.
  - ✅ **투자 화면 리워크 완료(2026-06-02, dev 커밋·미push) — A안 채택**: codex 기획·디자인 2회 리뷰 반영. 커밋 3개(`3dce05b` 차트색통일 / `36bf8f8` 투자 메인 리워크 / `ef77fa6` 전량매도 fix). 기획=`~/.claude/plans/refactored-hopping-sketch.md`.
    - **범위 = 투자 메인(/invest)만**. 계좌상세·종목상세는 다음 사이클. 목업=`~/.gstack/.../invest-rework-20260602/board.html`(A안 추이생략·추천 채택).
    - **portfolio-section 리워크**: Title "포트폴리오"→"투자"(탭통일)+종목추가 FAB / 잔액중심 2×2 Hero → **손익 Hero**(대표=평가액 totalValuation·손익 pill·메타 매입·현금) / 계좌별 도넛 → **종목별 비중 도넛**(Top5 고유색+기타·현금 회색묶음, codex "7색순환 혼동" 해소). i18n=portfolio 네임스페이스 키 추가(ko/en).
    - **차트 = recharts v3 유지**(codex 강권: @mantine/charts는 recharts3→2 다운그레이드 blast radius 큼). 미커밋 차트색통일분(design-tokens 팔레트 단일화+utils 중복제거+value/allocation-trend sage·웜그레이) 함께 커밋.
    - **손익색 = 기존 한국식 유지**(양수 danger 빨강·음수 info 파랑, profitColor). 목업의 positive 초록은 폐기(계좌상세·종목상세와 일관).
    - **전량매도 버그 fix(A 최소)**: 종목 전량매도 시 soft delete(data=null)되는데 portfolio-trade-section이 useSuspenseQuery로 재조회→404 throw로 화면깨짐. trade-form이 `res.body.data===null`→soldOut 신호, section이 cancelQueries+removeQueries(item) 후 계좌상세로 router.replace. **B(매매 화면 분리)는 다음 사이클**.
    - 검증: typecheck✅·lint✅. ⚠️ **browse 시각검증 미실시**(사용자가 커밋 먼저) — 전량매도 A fix 실동작·모바일/데스크톱 렌더 다음에 확인 권장.
    - ⚠️ codex 지적 중 **실현손익 진입점 보류**: overview summary에 누적 실현손익 필드/전체 매매손익 라우트 없음→거짓 진입점 우려로 미반영. 백엔드 필드 생기면 Hero 메타에 추가.
  - ✅ **투자 계좌상세·종목상세 리워크 완료 + 매매손익 IA 이동(2026-06-02, 미커밋)** — 계획 `~/.claude/plans/browse-async-blanket.md`, 목업 `~/.gstack/.../invest-rework-20260602/board-detail.html`, codex 디자인 리뷰 반영.
    - **핵심 IA 변경**: 종목상세 "매매손익(실현손익)" 탭은 전량매도 시 종목 soft delete로 조회 사각지대 → **종목 레벨→계좌 레벨로 이동**. 종목상세는 거래내역 단일(탭 제거), 계좌상세에 "누적 매매수익"(전량매도된 종목 매도까지 합산).
    - **백엔드(household-back, 미커밋)**: `/api/portfolio/accounts/{id}/realized-pnl` 신설(router/service `get_realized_pnl_by_account`/repository `find_sell_txs_by_account`(account+household 필터, ACTIVE SELL — 삭제 종목 매도 포함)/schema `RealizedPnlRow.name` 추가). **새 컬럼/마이그레이션 0** — `realized_pnl` 박제(`a3f7c9d2e1b8`) 재활용. (이전 "실현손익 진입점 보류"의 백엔드 부재가 이걸로 해소)
    - **프론트(미커밋)**: `RealizedPnlPanel` portfolioId|accountId 분기(내부 ItemRealizedPnl/AccountRealizedPnl + 공통 View — useSuspenseQuery 조건부 호출 불가라 컴포넌트 분리). account realized-pnl 쿼리/키/api/타입(name?) 추가. 계좌상세: hero 라벨 "계좌 총액"(codex #2 명확화)+평가손익 pill, 도넛 메인규칙(정렬후 PALETTE+기타/현금 회색), 누적 매매수익 패널, +종목추가 sage·chevron 토큰. 종목상세: 매매손익 탭 제거·전량매도 토스트 문구·i18n. portfolio 네임스페이스 키 다수 추가(ko/en).
    - 검증: typecheck✅·lint✅·**browse 통합검증✅**(dev useContext null 500은 중복 next dev 프로세스 정리+.next 삭제+재시작으로 해소). 계좌상세(계좌총액·pill·도넛PALETTE·누적매매수익 API 200·**전량매도된 KIWOOM 실현손익이 계좌 누적에 반영 확인**), 종목상세(매매손익 탭 없음·거래내역만), 모바일390+데스크톱, 콘솔에러 0(recharts width warning만). 전량매도 직접 실행은 실데이터 변경이라 미실시(KIWOOM 사례로 동작 입증).
  - ▶ **다음 작업 = 트랙② 디자인 마무리** (화면별 리워크: 로그인✅·홈✅·거래✅·투자(메인+계좌상세+종목상세)✅ → **내정보 남음** + V5 리브랜딩 텍스트/메타 + dev push). 백로그: 전량매도 B(매매 화면 분리). **거래 백엔드(household-back) 커서정렬 + 이번 realized-pnl 미커밋분 커밋 필요(front+back 양 레포).**
  - ⚠️ TaskList(V1~V5 5개)는 **세션 한정이라 휘발** — 이 activeContext 의 시각 트랙 줄 + 로드맵 `optimized-singing-russell.md` 가 정본. 다음 세션은 이 둘로 복원.

> 교훈: R5a-3(월별 배분추이)까지가 사용자가 생각한 적정 스코프. TWR/goal은 과한 기능. 트랙①(자산성격 단순화)만 R5a 위에 얹음.

## 병행 미결
- **dev→main 머지** — R1~R5b①(front+back) + R5b② 구조 트랙(front) 전부 dev push, main 미반영. front/back 두 레포.

> 금/채권ETF asset_class 재분류는 데이터 라벨링(SQL 추측 금지)이라 사용자가 폼에서 직접. 재분류하면 추이 STOCK→COMMODITY/BOND 분리가 다음 박제부터 반영(PVH는 박제 시점값 동결).
