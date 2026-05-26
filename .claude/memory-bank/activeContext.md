# 활성 컨텍스트

## Goal

가계부 앱 — 3 viewport 반응형 (휴대폰 <768 / 패드 768~1199 / 데스크탑 >=1200) + 편한가계부 시그니처 (빠른 입력 시트 ✅) + 시각 시스템 정리 (카드 위계 / 타이포 / 색).

## Status

### 완료 (브랜치 `feat/design-liner-tone`, 12 커밋, 미푸시)

| 커밋 | 내용 |
|---|---|
| `4f92f37` | **데스크탑 좌/우 카드 높이 일치** — 홈 카테고리/최근거래 + 거래 캘린더/선택일거래 |
| `00fd9b3` | 모자이크 토글(홈 총자산 blur) + 카테고리/최근거래 데스크탑 flex + FilterChip bg gray-1 + list 일별 그룹화 + 캘린더 좌/우 분할 |
| `e7284ea` | 카드 위계 분리 (hero p=xl shadow=md / sub padding lg shadow xs) |
| `1a84e32` | **빠른 입력 바텀시트** — 편한가계부 시그니처 1/2. FAB(모든 페이지 우하단) + Drawer 90% + TransactionForm 재사용 + useQuickAddStore |
| `8ddd5e9` | 데스크탑(>=lg) 차트 크게 (트렌드 96→200, 도넛 88→144) |
| `8332e3f` | 타이포 스케일 다운 (h3 28→24, login welcome 32) |
| `8b92723` | SubHeader 표준 컴포넌트화 + toss* alias 제거 + INCOME 색 = info(blue) |
| `c962396` | base-layout main 제거 — 박스 책임 각 layout 으로 |
| `5edb1d6` | primary 블루 시그니처 (#3B82F6) + Tailwind 500 일관 팔레트 |
| `cc0cb8d` | 3 viewport 반응형 + PWA standalone (safe-area, SidebarNav 신규) |
| `433fb59` | .env.claude gitignore |

### 폐기 (reset 됨)
- `2c902eb` 메인 캘린더 — "취소해줘"
- `2bee59b` 홈/거래 우측 패널 — "필요없을 듯"
- `949208e` 폼 maw 768 — "별로다"

### Skip (사용자 명시)
- 키보드 단축키
- 색상 전체 균형 재설계 (보류)
- icon 실제 디자인 (현재 SVG `₩` 그대로 OK)

## Context

### 핵심 결정
- primary = `info` (Tailwind blue-500 `#3B82F6`) — "파란색 시그니처"
- 팔레트 = Tailwind 500 시리즈 일관 (linerGreen/danger/info/warning/purple)
- toss* alias 완전 제거 (22+곳 의미적 키로 sed)
- 메인 캘린더 = 사용자 의도 X (시도 후 reset). 홈 = 기존 카드 흐름 유지 + 모자이크 + 데스크탑 flex
- 빠른 입력 시트 = TransactionForm 재사용 + `useQuickAddStore` (zustand) + 어디서나 FAB

### 기술 결정
- 반응형 = CSS only (`visibleFrom`/`hiddenFrom` + media query) — SSR 안전
- safe-area 토큰 `--safe-*` 모든 fixed 요소 (PWA standalone 대응)
- 컨테이너 max-width 토큰 `--container-max`: 448 / 768 / 1280
- BottomTab z=500 / QuickAddFab z=600 / Drawer/Modal z=1000
- 데스크탑 좌/우 분할 시 박스 높이 일치 = `Stack h="100%"` + `Card flex:1` (SimpleGrid/Grid stretch)

### 사용자 흐름 결정
- "수입은 파랑" — INCOME 색 = info(blue) 일관 (tx-row/table/calendar-view/category Badge)
- 홈 총자산 모자이크 = 기본 hidden + 클릭 토글, 세션 동안만 (localStorage X)
- 거래 list = 일별 그룹화 ("5월 26일 (월)" 헤더)
- 거래 캘린더 = 데스크탑 좌/우 분할 (모바일/패드 위/아래)
- /transactions/new 풀페이지 라우트 = 보조용 유지 (딥링크)

### 제약
- 사용자 본인이 매일 쓰는 도구 — 회귀 0 우선
- Mantine 8 + Next 14 + Tailwind 4
- pnpm 만 (npm/yarn 금지)
- 새 의존성 안 늘림
- 모바일 viewport 우선 (향후 PWA 설치)

## Next Step

**현재 상태 안정** — 12 커밋 미푸시, 빌드/타입/린트 다 통과.

사용자 시각 확인 (`pnpm dev`) 후 다음 결정:
1. 어색한 곳 있으면 추가 조정
2. 색상 전체 균형 재설계 (~4h, 보류 중) 진행 여부
3. push 또는 PR 생성 여부 (현재 12 커밋 origin 보다 앞섬)

메인 캘린더 / 단축키 / icon 디자인 / 우측 패널 = 사용자 의도 X 또는 폐기 → 다시 제안 X.
