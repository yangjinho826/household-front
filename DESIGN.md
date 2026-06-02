# DESIGN.md — 모음 디자인 시스템 (Warm Ledger)

> 가계부 × 자산 통합 앱 "모음"의 시각 시스템 정본.
> R5b 트랙② 시각 트랙 V2 산출물. V1(design-shotgun)에서 선택된 **Warm Ledger** 무드를 폰트/컬러/spacing/모션 시스템으로 확정한 문서.
> 코드 적용(V3 토큰화~V5 리브랜딩)은 이 문서를 기준으로 진행한다.

---

## 1. 미학 (Aesthetic)

**한 줄**: 따뜻한 어스톤의 "일상 가계부" — 자산 숫자는 차분하게, 화면 전체는 편안하게.

| 원칙 | 의미 |
|---|---|
| 차분한 어스톤 | 쨍한 원색 대신 채도 낮은 세이지/테라코타/크림. 매일 봐도 피로하지 않게 |
| 숫자는 또렷하게 | 무드는 따뜻하되 총자산·손익 숫자 가독성은 절대 양보 X (산세리프 tabular) |
| 큰 라운드 + 부드러운 그림자 | 24px 카드 라운드, 갈색 톤의 옅은 그림자로 종이 질감 |
| 세리프는 양념만 | 브랜드명·섹션 타이틀에만 세리프 → 품격 한 스푼, 본문 가독성 유지 |
| 여백으로 위계 | 경계선 최소화. 여백·배경 대비·라운드로 그룹을 나눔 |

**안 하는 것**: 다크 프리미엄 글로우(B안), 쨍한 풀컬러 대시보드, 빽빽한 정보 밀도, 차가운 쿨그레이.

---

## 2. 컬러 시스템

라이트 모드 기준. 다크 모드는 이번 스코프 밖(필요 시 따뜻한 다크 = 딥브라운 배경 + 크림 텍스트로 후속).

### 2-1. 표면 (Surface)

| 역할 | hex | 용도 |
|---|---|---|
| `bg` | `#FAF6EF` | 페이지 배경 (크림/오트밀) |
| `card` | `#FFFDF9` | 카드 표면 (배경보다 살짝 밝게 — 떠 보이게) |
| `card-sunken` | `#F3EEE4` | 눌린 영역 / 입력 filled 배경 |
| `border` | `#EFE7DD` | 최소한의 경계선 (대부분 여백으로 대체) |

### 2-2. Primary — 세이지 그린 (브랜드 / 액티브 / 긍정 강조)

base `#7C9473`. Mantine tuple 0→9:

```
sage: [
  "#F4F7F2", "#E6EDE2", "#CDDBC6", "#AFC4A4", "#93AC85",
  "#7C9473", "#647A5C", "#4F6149", "#3D4B39", "#2C3629"
]
```

- **primaryShade light = 6** (`#647A5C`) — shade 5(`#7C9473`)는 흰 텍스트 대비 3.34:1로 WCAG AA(4.5) 미달. shade 6은 4.73:1 통과 (codex 검증)
- 브랜드 로고, 탭바 액티브, primary 버튼/액션 (긍정·증감 강조는 ❌ → `positive` 토큰 사용, 2-4 참조)

### 2-3. Accent — 테라코타 (보조 강조 / 포인트)

base `#D98E73`. tuple 0→9:

```
terracotta: [
  "#FCF4EF", "#F7E3D9", "#EFCBB8", "#E7B097", "#E5B197",
  "#D98E73", "#C2674A", "#A4543B", "#83432F", "#5F3122"
]
```
> shade 4를 `#E5B197`로 밝게 벌림 — 원안은 4(`#DD9A7E`)/5(`#D98E73`)가 거의 같아 단계 구분이 약했음(codex 지적).

- 강조 배지, 보조 CTA, 일러스트 포인트, 빈 상태(empty) 일러스트
- 진한 강조·흰 텍스트 올릴 땐 `#C2674A`(shade 6) 이상 (base 5는 살구색이라 대비 약함)

### 2-4. 의미색 (Semantic) + 초록 역할 분리 ✅

V1 결정: **수입=파랑 / 지출=빨강 그대로**. 관습·가독성 우선. 기존 `info`/`danger` tuple 유지.

**초록 역할 분리 (codex 검토 반영)**: 브랜드색(sage)과 "양수/수익" 신호색이 둘 다 초록이면 충돌하므로 역할을 고정한다. 기존 `linerGreen`(`#22C55E` 쨍초록)은 어스톤 무드에서 튀므로 **`positive`(`#2F855A` 차분한 금융초록)로 값+이름 교체**.

| 의미 | 색 | tuple 키 | 역할 |
|---|---|---|---|
| 브랜드 / 액션 | `#7C9473` | `sage` | primary 버튼·로고·탭 액티브 (의미색 아님) |
| **양수 / 수익 / 상승** | **`#2F855A`** | **`positive`** | 증감·손익 양수, 적립. `linerGreen` 폐기 후 이걸로 |
| 수입 / 안내 | `#3B82F6` | `info` (blue) | 그대로 |
| 지출 / 손실 / 하락 / 위험 | `#EF4444` | `danger` (red) | 그대로 (음수 손익 포함) |
| 주의 / 임박 | `#F59E0B` | `warning` (amber) | 그대로 |
| 투자 보조 | `#8B5CF6` | `purple` (violet) | 그대로 |

`positive` tuple (base 5 = `#2F855A`, 양수 텍스트는 6~7 권장):
```
positive: [
  "#E7F3EC", "#C6E3D2", "#9FCFB2", "#73B88E", "#4E9F70",
  "#2F855A", "#266E4A", "#1F5A3D", "#184430", "#102E20"
]
```

**최종 색 역할 한눈에**:
```
sage       → 브랜드 / primary action / 탭 액티브
positive   → 양수·수익·상승 (▲)
blue(info) → 수입
red(danger)→ 지출 / 손실 / 하락 (▼)
terracotta → 보조 CTA / 따뜻한 강조
```

> ⚠️ **튐 주의**: 따뜻한 크림 배경(`#FAF6EF`)에 Tailwind 500 파랑/빨강이 약간 튄다. **값은 유지하되**, 큰 면적(배경 fill, 큰 배지)에 쓸 땐 shade 6~7 또는 알파 합성(`${color}14`)으로 톤을 눌러 어스톤과 어울리게. 텍스트·작은 인디케이터는 500 그대로 OK.

### 2-5. 중립 — 웜 그레이로 교체

기존 grayScale은 토스 쿨그레이(`#8B95A1` 등 푸른끼). Warm Ledger는 베이지 섞인 웜그레이로 교체:

```
gray: [
  "#F7F4EF", "#EDE8E0", "#DDD5C9", "#C3B9A9", "#A99C8D",
  "#9C8F82", "#7A6F63", "#5A5149", "#423B34", "#3C3530"
]
```

| 역할 | shade | hex |
|---|---|---|
| 본문 텍스트 | 9 | `#3C3530` |
| 보조/dimmed 텍스트 | **6** | **`#7A6F63`** (gray.5 `#9C8F82`는 크림 배경 대비 ~3:1로 본문성 텍스트엔 약함 — codex) |
| placeholder / disabled / metadata | 5 | `#9C8F82` |
| divider | 1~2 | `#EDE8E0` / `#DDD5C9` |

---

## 3. 타이포그래피

### 3-1. 폰트 패밀리

| 역할 | 폰트 | 적용 |
|---|---|---|
| **거의 모든 텍스트** | **Pretendard** (기존 유지) | 본문·라벨·숫자·**섹션/카드 타이틀**. 숫자는 `font-variant-numeric: tabular-nums` |
| **브랜드 로고만** | **세리프** | "모음" 로고 1곳. 페이지 h1은 선택적 허용 |

최종 결정 (codex 반영, V1 원안에서 축소): **세리프는 "모음" 브랜드 로고만**. 섹션/카드 타이틀은 Pretendard(한글 세리프 작은 타이틀은 이질감·가독 손해). 본문·총자산 숫자·라벨 전부 산세리프.

**세리프 폰트 선정**:
- 스택: `'Noto Serif KR', 'Nanum Myeongjo', Georgia, serif`
- 적용 범위가 로고 1곳이라 로딩 부담 거의 없음 — **weight 400/700만**, `font-display: swap`, 가능하면 **self-host/subset**(FOUT로 브랜드 첫인상 흔들림 방지)
- ⚠️ 큰 숫자·금액·표·차트 라벨은 **세리프 절대 금지** → Pretendard tabular

### 3-2. 타입 스케일 (기존 Mantine fontSizes 유지 + headings 폰트만 교체)

| 토큰 | size | 용도 |
|---|---|---|
| xs | 12 | 캡션, 보조 라벨 |
| sm | 13 | 보조 본문 |
| md | 16 | 기본 본문 |
| lg | 20 | 강조 텍스트 |
| xl | 28 | 큰 숫자/제목 |
| 총자산 hero | 36~40 | 별도 — Pretendard 800, tabular |

headings (h1 40 / h2 32 / h3 24 / h4 20) 크기 유지. **fontFamily는 Pretendard 유지** (세리프 전면 교체 취소 — 브랜드 로고는 별도 컴포넌트에서 세리프 클래스 직접 적용). h1만 editorial 화면에서 선택적 세리프 허용.

---

## 4. 스페이싱

기존 4px 베이스 스케일 **그대로 유지** (변경 X):

```
xs 4 · sm 8 · md 12 · lg 16 · xl 24 · 2xl 32 · 3xl 48 · 4xl 64
```

---

## 5. Radius (라운드)

Warm Ledger 핵심 = 큰 라운드. 카드를 더 둥글게.

| 토큰 | 기존 | Warm Ledger | 비고 |
|---|---|---|---|
| 카드 (`3xl`) | 24 | **24 유지** | 카드 기본을 `3xl`로 (현재 `xl`=16) |
| 입력/작은 요소 (`lg`) | 12 | 12 | 유지 |
| pill (`full`) | 9999 | 9999 | 버튼·배지 |

**변경점**: Card defaultProps `radius`를 `xl`(16) → `3xl`(24)로. 입력류는 `lg`(12) 유지.

---

## 6. Elevation (그림자)

기존 그림자는 `rgba(0,0,0,...)` 무채색. Warm Ledger는 **갈색 톤 그림자**로 종이 질감:

```
xs: 0 1px 2px rgba(120, 100, 70, 0.04)
sm: 0 2px 6px rgba(120, 100, 70, 0.06)
md: 0 6px 16px rgba(120, 100, 70, 0.08)
lg: 0 12px 28px rgba(120, 100, 70, 0.10)
xl: 0 20px 40px rgba(120, 100, 70, 0.12)
```

- 기본 카드 = `xs` (거의 평평, 배경 대비로 구분)
- hero 카드 / 모달 = `md`

---

## 7. 모션 (Motion)

| 상황 | duration | easing |
|---|---|---|
| 기본 트랜지션 (hover, 색 변화) | 160ms | `ease-out` |
| 카드/모달 등장 | 220ms | `cubic-bezier(0.22, 1, 0.36, 1)` (부드러운 감속) |
| 숫자 카운트업 (총자산 등, 선택) | 600~800ms | `ease-out` |
| 탭 전환 | 200ms | `ease-in-out` |

원칙: 빠르고 부드럽게. 튕기는(bounce) 모션 X — 차분한 무드 유지. 과한 패럴랙스/스크롤 연출 X.

---

## 8. 코드 매핑 가이드 (V3 토큰화 작업 명세)

대상: `src/_styles/mantineTheme.ts`, `src/_styles/design-tokens.ts`.

### 8-1. mantineTheme.ts

| 항목 | 현재 | 변경 |
|---|---|---|
| `colors.sage` | 없음 | **추가** (2-2 tuple) |
| `colors.terracotta` | 없음 | **추가** (2-3 tuple) |
| `colors.positive` | 없음 | **추가** (2-4 tuple, base `#2F855A`) |
| `colors.linerGreen` / `success` | Tailwind green `#22C55E` | **제거** → `positive`로 대체 (사용처 일괄 치환, 아래 8-3) |
| `colors.gray` | 토스 쿨그레이 | **웜그레이로 교체** (2-5) — 사용처 다수, 회귀 확인 |
| `primaryColor` | `"info"` (파랑) | **`"sage"`** 로 변경 (브랜드 = 세이지) |
| `primaryShade` | `{light:5, dark:4}` | **`{light:6, dark:4}`** (대비 — 2-2) |
| `info`/`danger`/`warning`/`purple` | Tailwind | **유지** (의미색) |
| `headings.fontFamily` | `Pretendard` | **유지** (세리프 전면 교체 취소 — 로고만 별도 적용) |
| `fontFamily` (본문) | Pretendard | 유지 |
| `defaultRadius` | `"xl"` | **유지** (전역 바꾸면 입력류 영향 — Card만 개별 변경) |
| `Card` defaultProps radius | `"xl"`(16) | **`"3xl"`**(24) — radius 토큰에 `3xl: rem(24)` 이미 존재, 확장 불필요 |
| `shadows` | 무채색 | **갈색 톤으로 교체** (6) |

> ⚠️ `primaryColor`를 info(파랑)→sage(초록)로 바꾸면 **현재 파랑이던 Button·Anchor·Tabs·Switch·Checkbox·Pagination·active nav가 한꺼번에 세이지로** 바뀐다(codex). 의미색 파랑(수입)과 브랜드색 분리가 의도. **사용 규칙(필수)**: "수입/안내는 반드시 `c="info"` 명시, primary는 브랜드/행동색 전용". primary 의존 컴포넌트 회귀 확인.

### 8-3. linerGreen → positive 치환 (사용처 일괄)

기존 `c="linerGreen.6"` 등 7곳+를 `positive`로 교체. 양수 표시 권장 shade = `positive.6`(`#266E4A`):

| 파일 | 위치 |
|---|---|
| `_sections/home/components/total-asset-hero.tsx` | momPct/diff/periodPct 양수 (3곳) |
| `_sections/wealth/components/value-trend-chart.tsx` | momPct 양수 |
| `_sections/wealth/components/account-balance-trend.tsx` | periodPct 양수 |
| `_sections/wealth/components/portfolio-value-trend.tsx` | periodPct 양수 |
| `_sections/wealth/components/snapshot-drilldown-panel.tsx` | 양수 |
| `_sections/account/account-report-section.tsx` | `c`/`fill` (2곳) |
| `_features/account/constants.ts` | `SAVINGS: "linerGreen"` → `"positive"` |

> `fill="var(--mantine-color-linerGreen-6)"` 같은 CSS 변수 참조도 `--mantine-color-positive-6`으로. grep `linerGreen` 으로 잔존 0 확인.

### 8-2. design-tokens.ts (`TOKEN`)

인라인 hex 참조용. Warm Ledger 값으로 교체:

```ts
export const TOKEN = {
  sage: "#7C9473",          // 브랜드
  sageAction: "#647A5C",    // filled 버튼 (primaryShade 6 대비)
  terracotta: "#D98E73",    // accent
  positive: "#2F855A",      // 양수/수익/상승 (linerGreen 대체)
  blue: "#3B82F6",          // info — 수입 (유지)
  red: "#EF4444",           // danger — 지출/손실 (유지)
  amber: "#F59E0B",         // warning (유지)
  purple: "#8B5CF6",        // 투자 보조 (유지)
  bg: "#FAF6EF",
  card: "#FFFDF9",
  text: "#3C3530",
  textDim: "#7A6F63",       // gray.6 (구 #9C8F82는 대비 약함)
} as const;

export const DEFAULT_ACCENT = TOKEN.sage; // blue → sage
```

> 도넛/차트 자산군 색: 부동산=sage / 투자=info(파랑) / 현금=웜그레이 / 연금=terracotta / 금·원자재(COMMODITY)=amber — 어스톤 위주로 재배치(V4 차트 교체 때 확정).

---

## 9. 안 하는 것

- ❌ 세리프를 브랜드 로고 밖에 (섹션/카드 타이틀·본문·숫자 전부 Pretendard)
- ❌ 의미색 파랑/빨강 변경 (관습 유지 — V1 결정)
- ❌ `linerGreen`/`#22C55E` 잔존 (전부 `positive` `#2F855A`로 치환 — 8-3)
- ❌ 브랜드 sage를 양수·수익 신호로 사용 (그건 positive 전용 — 초록 역할 혼동 금지)
- ❌ 다크 프리미엄 글로우 / 네온 (B안 방향 폐기)
- ❌ 쿨그레이 잔존 (웜그레이로 통일)
- ❌ 큰 면적에 Tailwind 500 원색 풀채도 (배경엔 shade 6~7 또는 알파)
- ❌ 바운스·과한 모션
- ❌ shadcn 등 다른 디자인 시스템 도입 (Mantine theme 위에서 토큰만 교체)
