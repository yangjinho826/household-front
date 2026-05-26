# household-front

가계부 앱 프론트엔드 (모바일 토스 스타일).
**bims-control 구조 + cnnet 응답 래퍼/에러 메시지 형식 채택.** 단 cnnet 의 `/api/front/v1` 경로, `dataStatCd` 논리 삭제, 감사 필드 는 안 따름.

<!-- BEGIN claude-init managed: rules -->
## 적용 룰

<!-- ~/.claude/rules/ 의 룰 파일들을 @import. claude-init 이 자동 생성/갱신 (마커 안만 갱신) -->

<!-- common -->
@~/.claude/rules/common/README.md
@~/.claude/rules/common/coding.md
@~/.claude/rules/common/git.md
@~/.claude/rules/common/style.md

<!-- javascript -->
@~/.claude/rules/javascript/README.md
@~/.claude/rules/javascript/style.md

<!-- typescript -->
@~/.claude/rules/typescript/README.md
@~/.claude/rules/typescript/strict.md
@~/.claude/rules/typescript/style.md

<!-- typescript-react -->
@~/.claude/rules/typescript-react/README.md
@~/.claude/rules/typescript-react/general.md
@~/.claude/rules/typescript-react/state.md
@~/.claude/rules/typescript-react/testing.md

<!-- typescript-nextjs -->
@~/.claude/rules/typescript-nextjs/README.md
@~/.claude/rules/typescript-nextjs/app-router.md
@~/.claude/rules/typescript-nextjs/data-fetching.md
@~/.claude/rules/typescript-nextjs/server-actions.md
@~/.claude/rules/typescript-nextjs/server-components.md

<!-- personal-frontend / bims-control 룰은 import 안 함 -->
<!-- - personal-frontend: shadcn/ui 강제 + Mantine 금지 → 실제와 정반대 -->
<!-- - bims-control: /api/front/v1 경로, javaFetch, dataStatCd, 감사 필드 같은 cnnet 항목이 본문에 박혀 있어 부분 채택 표현 어려움 -->
<!-- 프로젝트 특수 패턴은 아래 "프로젝트 메모" 섹션에 직접 정리 -->

<!-- END claude-init managed: rules -->
## 빌드/실행

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm test
```

shadcn 컴포넌트 추가:
```bash
pnpm dlx shadcn@latest add <component>
```

## 프로젝트 메모

가계부 앱 (모바일 토스 스타일).

### 스택 (실제 적용)
- Next.js 14.2.23 + React 18.3.1 + TypeScript strict
- Tailwind 4 (`@theme inline` CSS 변수) + **Mantine 8.x** (`_providers/mantine-provider.tsx`, `_styles/mantineTheme.ts`)
- 아이콘: `@tabler/icons-react` (lucide-react 안 씀)
- TanStack Query 5 + Zustand 5 + `@lukemorales/query-key-factory`
- next-intl v4 (`app/[locale]/...`)
- URL 상태: `nuqs`. 폼: `@mantine/form` + `zod`. 차트: `recharts`. 날짜: `dayjs`. JWT: `jose`
- pnpm (npm/yarn 금지)
- **fetch**: `apiFetch` (return-fetch 4 체인 — cookie → refresh → api → json)
- **응답 타입**: `ApiResponse<T>` / `ApiListResponse<T>` (모든 필드 required) — cnnet `ResultVO` 와 동일 컨셉
- **에러**: `ApiResponseError` (status / errorCode / errorMessage / errorHandleMethod), 메시지 형식은 cnnet 표준 (`~에 실패했습니다`)
- **API 경로**: `/api/{도메인}/{동작}` — cnnet 의 `/api/front/v1` prefix 는 **안 씀**
- **논리 삭제 / 감사 필드**: 안 씀 (cnnet 컨벤션 미적용)

### 디렉토리 (bims 100% 매칭)

```
src/
├── _features/    # 도메인 (household, account, transaction, portfolio, category, fixed, common, layout 등)
├── _libraries/   # auth, fetch, i18n, ui (shadcn)
├── _providers/   # query-provider, mantine-provider, search-params-provider 등
├── _sections/    # 페이지 단위 (auth, home, transaction, wealth, portfolio, settings 등)
├── _styles/      # design-tokens (토스 색상 C.*)
├── _utilities/   # fmt, icons, utils
├── _constants/   # apiBaseUrl, authLoginUrl
├── _messages/    # ko.json, en.json
└── _types/       # env.d.ts
```

### Layout 4단

`app/layout.tsx` (passthrough) → `[locale]/layout.tsx` (BaseLayout) → `(group)/layout.tsx` (UserShell/AuthShell) → `<route>/page.tsx` (Section 1줄 마운트)

### Section 패턴

- `page.tsx` 는 1줄 마운트
- `_sections/<페이지>/<name>-section.tsx` 는 organism 조립만
- organism 은 `_features/<도메인>/components/`

### 표준 참조 모듈

**`_features/household/`** 또는 `_features/transaction/` — 신규 도메인 만들 때 참조 (api/queries/components/hooks 구조)
