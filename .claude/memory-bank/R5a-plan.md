# R5a 계획 — 자산성격(asset_class) 배분 + 부동산·연금(ManualAsset) + 월별 배분추이

> 이 문서 하나로 다른 컴퓨터에서 이어받아 작업 가능. 진행상황은 맨 아래 "진행 현황" 참조.
> front/back 두 레포 모두 관련 (back = `C:\Users\USER\Projects\household\household-back`).

## 다른 컴퓨터에서 이어받기 (실행 가이드)

```bash
# 1) 두 레포 pull (dev 브랜치)
cd household-back  && git checkout dev && git pull
cd household-front && git checkout dev && git pull

# 2) 백엔드 마이그레이션 적용 (필수 — 안 하면 asset_class 컬럼 없어서 500)
cd household-back && uv run alembic upgrade head    # head = b8e4d1a09c37 (R5a-1 기준)

# 3) 서버 기동
cd household-back  && uv run uvicorn app.main:app --reload --port 9000
cd household-front && pnpm install && pnpm dev       # 의존성 변경 없으면 install 생략 가능

# 4) 검증 (QA 섹션 참조)
```

환경: 백 9000, 프론트 3000, DB docker `household-postgres`(household/1234/HOUSEHOLD).
계정 yangjinho826@naver.com / 비번 wlsghdid2@. household=`62cfbbe6-f3df-4aa2-8f30-eb9ec4dd8c58`.
인증: `POST /api/auth/login` → accessToken → `Authorization: Bearer` + `X-Household-Id` 헤더.

> ⚠️ 로컬 reload 주의: 기존에 떠있는 9000 서버가 reload 모드가 아니면 새 코드 반영 안 됨.
> 코드 바꾸면 서버 재시작하거나 `--reload`로 띄울 것. (R5a-1 QA 때 9001 별도 포트로 검증함)

---

## 제품 목표
"매월 내 총자산이 어떻게 변하는지 한눈에" (총자산 기준, 부채/순자산 안 함). 한국 개인 사용자.

## 배경 — 왜 이 작업
자산 분류 축이 `market`(거래소: KRX_KOSPI/NASDAQ…) 하나뿐 → 사용자가 **금을 KRX_KOSPI에 욱여넣은** 상태. 금·채권·현금을 담을 "자산 성격" 축이 없음.

설계는 codex(gpt-5.5) 교차검증 + Plan agent 탐색으로 확정.
핵심 통찰: **모든 자산은 계좌(account)를 거쳐야 총자산/추이에 들어온다** (총자산 = `Σ account.balance`, 추이 = `Σ account_snapshot.balance`). → 부동산·연금도 전용 계좌로 roll-up하면 기존 집계가 코드 수정 없이 자동 반영.

## 분류 표준안 — 2축 분리 (확정)
| 축 | 값 |
|---|---|
| `market` (기존) | KRX_KOSPI / KRX_KOSDAQ / NASDAQ / NYSE / OTHER |
| `asset_class` (신규) | STOCK / BOND / COMMODITY / CASH / REAL_ESTATE / PENSION / OTHER |

- **ETF는 asset_class가 아님** — wrapper(형태)일 뿐. 금ETF·금현물 둘 다 COMMODITY, 주식ETF(KODEX200)는 STOCK, 채권ETF는 BOND.
- **가격 갱신은 `market` 축으로만** 동작(`market_price/service.py`, yahoo_suffix). asset_class 바꿔도 야후 갱신 안 깨짐. → 금ETF는 market=KRX_KOSPI 유지 + asset_class만 COMMODITY로.

## 핵심 결정 (codex 검증 반영)
| 결정 | 선택 | 근거 |
|---|---|---|
| 부동산/연금 모델 | **ManualAsset 신규 도메인** (PortfolioItem 확장 X) | market/quantity/avg_price가 부동산에 안 맞음 |
| asset_class 위치 | **leaf(PortfolioItem, ManualAsset)에**. 계좌 현금은 CASH 슬라이스 | 계좌-only는 혼합 투자계좌에서 깨짐 |
| roll-up | ManualAsset → **전용 계좌(REAL_ESTATE/PENSION AccountType)** | 총자산·추이 집계 자동 반영 |
| 월별 배분추이 | **asset_class_snapshots 전용 테이블** 신설 | account_snapshot은 계좌총액만 → 슬라이스 재구성 불가(codex "aggregation loss") |
| 백필 | 전부 STOCK 기본 + **UI에서 사용자 재분류** | SQL 추측 금지 |

## codex가 경고한 함정 (R5a-2/3에서 반드시 반영)
- **carry-forward / as-of**: 수동자산 박제 = "`valued_at <= 스냅샷월`인 최신 valuation". 0도 latest-ever도 아님. 매달 재입력 강요 금지.
- **historical truth**: 과거 달 박제가 거짓이 안 되게 effective-date 기반.
- **active/effective date**: `is_archived`만으론 과거 존재 표현 불가 → acquired/disposed 날짜로 박제 필터.
- **double counting**: ManualAsset은 전용계좌 balance = as-of valuation 합으로만. 은행 계좌 별개 → 구조적 이중계상 불가. 자동 현금차감 안 함.

---

## 단계별 구현 (각 단계 = 1 커밋, 마이그레이션 A/B/C 독립)

### ✅ R5a-1 — asset_class + 현재 배분 파이 (완료)
**백엔드**
- `portfolio/enum.py`: `AssetClass(StrEnum)` 신설.
- `portfolio/model.py`: `asset_class String(20) NOT NULL server_default 'STOCK'`.
- 마이그레이션 A `b8e4d1a09c37_add_portfolio_asset_class` (Revises a3f7c9d2e1b8). 백필 없음.
- `enum/service.py` `_DISPATCH`: `"asset-class": AssetClass`.
- `portfolio/schema.py`: Create/Update Request + Response에 asset_class.
- `portfolio/service.py`: create/update/_build_response 반영.
- `wealth/service.py` `_build_allocation` + `wealth/schema.py` `AssetClassSlice`/`AllocationResponse`. `WealthOverviewResponse.allocation` 추가.

**프론트**
- `_features/enum/types.ts`: EnumName에 "asset-class".
- `_features/portfolio/types.ts`: `AssetClass` 타입 + Create/Update/ListItem 필드.
- `_features/portfolio/constants.ts` (신규): `ASSET_CLASS_COLOR`.
- `_features/portfolio/hooks/use-sub/use-form.tsx` + `components/form.tsx`: 자산성격 Select.
- `_features/wealth/types.ts` + `api.ts`: allocation 타입/매핑.
- `_sections/wealth/wealth-section.tsx`: "자산군 배분" 도넛 카드(`PortfolioDonut` 재사용).
- `_messages/ko.json` + `en.json`: `enum.asset-class.*`, `portfolio.asset_class*`.

**검증 완료**: 마이그레이션 가역성 왕복 OK · 프론트 typecheck 통과 · 9001 QA에서 `wealth/overview.allocation` 정상(CASH 75.46% + STOCK 24.54% = totalBalance, ratio 합 100%). 금은 아직 STOCK(기본값) — UI에서 COMMODITY 재분류 시 분리됨.

### ⬜ R5a-2 — ManualAsset + 평가이력 (다음)
**백엔드** 신규 `app/domain/manual_asset/{model,repository,service,router,schema}.py`
- `account/enum.py` `AccountType`에 `REAL_ESTATE`, `PENSION` 추가.
- 테이블 `manual_assets`: household_id, account_id(roll-up 대상), name, asset_class, current_valuation, valued_at, is_archived, (acquired_at/disposed_at).
- 테이블 `manual_asset_valuations`: household_id, manual_asset_id, valued_at(effective), valuation, memo.
- 마이그레이션 B `create_manual_assets`.
- repository: `valuation_as_of(asset_id, as_of_date)` = valued_at<=date 최신 1건. `sum_current_valuation_by_account(account_id)`.
- **roll-up 통합**: `account/service.py:46` `_calc_balance`에 ManualAsset 계좌 분기 추가(balance = sum_current_valuation_by_account). → home/wealth 자동 반영.
- service: create(asset+초기 valuation), update_valuation(새 row+캐시 갱신), list, soft delete. accountId 미지정 시 가계부당 asset_class별 전용계좌 lazy 생성.
- router: `POST /manual-asset/create`, `PUT /manual-asset/{id}/valuation`, `GET /manual-asset/list`, `DELETE /manual-asset/{id}`. `app/main.py` include.
- `wealth/service.py _build_allocation`: ManualAsset를 asset_class별 valuation에 합산.

**프론트** 신규 `_features/manual-asset/` + `_sections/manual-asset/`
- query-key: `createQueryKeys("manualAsset")` + `_constants/queries.ts` mergeQueryKeys.
- mutations: `invalidateAll` 패턴(`portfolio/queries/use-mutations.ts` 참고 — wealth/home/accountSnapshot/account `_def` 무효화).
- 입력 폼: `@mantine/form` + `zodResolver`. name / assetClass(Select) / valuation(NumberInput) / valuedAt(`@mantine/dates` DatePickerInput).
- **통장 리스트 UX 분리**: wealth-section에서 REAL_ESTATE/PENSION 계좌는 "부동산·연금" 섹션 분리(통장처럼 안 보이게). "부동산·연금 추가" 버튼.

### ⬜ R5a-3 — 스냅샷 통합 + 월별 배분추이
**백엔드** 신규 `app/domain/asset_class_snapshot/{model,repository,service}.py`
- 테이블 `asset_class_snapshots`: household_id, snapshot_date(그달 1일), asset_class, valuation. unique(household_id, snapshot_date, asset_class).
- 마이그레이션 C `create_asset_class_snapshots`.
- `snapshot_household_allocation(db, household, snapshot_date, replace=)`: INVESTMENT 종목→asset_class별 qty*current_price, 계좌 cash→CASH, ManualAsset→as-of(snapshot_date) carry-forward(acquired/disposed 필터). 그달 hard delete 후 insert.
- **통합 지점**: `account_snapshot/service.py:133` `snapshot_household_portfolio` 호출 **직후** `snapshot_household_allocation(...)` 추가. catch-up/upsert/replace 플래그 전파.
- 월별추이 조회: `find_by_household_and_range`. `WealthOverviewResponse.allocation`에 `allocationTrend` 추가.

**프론트** 신규 `_sections/wealth/components/allocation-trend-chart.tsx`
- recharts `AreaChart` + asset_class마다 `<Area stackId="1">` (스택 영역).
- **SSR 가드 = `value-trend-chart.tsx`의 `useMounted` 패턴 그대로** (마운트 전 빈 div). [[recharts-ssr-mount-guard]]
- 데이터변환: `allocationTrend` → `[{month, STOCK, CASH, REAL_ESTATE,...}]` 없는 슬라이스 0 채움.

---

## API 응답 형태 (ApiEnvelope, camelCase)
`GET /api/wealth/overview` → `data.allocation`:
```jsonc
{
  "currentAllocation": [ { "assetClass":"STOCK", "valuation":12000000, "ratio":42.0 }, ... ],
  // R5a-3 이후:
  "allocationTrend": [ { "snapshotDate":"2026-01-01", "slices":[ {"assetClass":"STOCK","valuation":11000000}, ... ] } ]
}
```

## QA
- 마이그레이션 가역성: `alembic upgrade head` → `downgrade -N` → `upgrade head` 왕복.
- curl: `wealth/overview` → currentAllocation 합 == totalBalance, ratio 합 ≈ 100.
- as-of(R5a-3): ManualAsset valuation을 과거 valued_at으로 넣고 수동 박제(`POST /api/account-snapshot/create`) → 과거 달이 latest 아닌 as-of 값으로 박히는지 `asset_class_snapshots` 직접 조회.
- 이중계상: 부동산 등록 전후 totalBalance가 valuation만큼만 증가(현금 변동 0).
- 로컬 DB head 뒤처지면 거래내역/매매손익/배분 조용히 500 (마이그레이션 드리프트 교훈).

## Critical Files
- back `app/domain/account/service.py` (`_calc_balance:46` — ManualAsset roll-up 통합점)
- back `app/domain/account_snapshot/service.py` (`_build_and_save_snapshot:133` — 슬라이스 박제 통합점)
- back `app/domain/wealth/service.py` (`_build_allocation` — 배분 집계)
- front `src/_sections/wealth/wealth-section.tsx` (배분 카드/추이/ManualAsset 진입 부착점)
- front `src/_features/portfolio/components/portfolio-donut.tsx` (배분 파이 재사용)
- front `src/_sections/wealth/components/value-trend-chart.tsx` (SSR 가드 패턴)

## 작업 순서
✅ R5a-1(완료·미커밋→커밋 예정) → ⬜ R5a-2(ManualAsset) → ⬜ R5a-3(스냅샷+추이). 각 단계 typecheck/curl 검증 후 커밋.
