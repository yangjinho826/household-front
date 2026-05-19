# household-front

가계부 앱 프론트엔드 (모바일 토스 스타일).
스택: `personal-frontend` 룰 적용 (bims 컨벤션 + shadcn/ui).

## 적용 룰

<!-- ~/.claude/rules/ 의 룰 파일들을 @import. claude-init 이 자동 생성 -->

<!-- common -->
@~/.claude/rules/common/coding.md
@~/.claude/rules/common/git.md
@~/.claude/rules/common/style.md

<!-- javascript -->
@~/.claude/rules/javascript/style.md

<!-- typescript -->
@~/.claude/rules/typescript/strict.md
@~/.claude/rules/typescript/style.md

<!-- typescript-react -->
@~/.claude/rules/typescript-react/general.md
@~/.claude/rules/typescript-react/state.md
@~/.claude/rules/typescript-react/testing.md

<!-- typescript-nextjs -->
@~/.claude/rules/typescript-nextjs/app-router.md
@~/.claude/rules/typescript-nextjs/data-fetching.md
@~/.claude/rules/typescript-nextjs/server-actions.md
@~/.claude/rules/typescript-nextjs/server-components.md

<!-- personal-frontend -->
@~/.claude/rules/personal-frontend/design.md
@~/.claude/rules/personal-frontend/general.md

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

### 스택 (bims 표준)
- Next.js 14.2.23 + React 18.3.1 + TypeScript strict
- Tailwind 4 (`@theme inline` CSS 변수) + shadcn/ui (`_libraries/ui/`)
- TanStack Query 5 + Zustand 5
- next-intl v4 (`app/[locale]/...`)
- pnpm (npm/yarn 금지)
- **fetch**: `apiFetch` (return-fetch 4 체인 — cookie → refresh → api → json)
- **응답 타입**: `ApiResponse<T>` / `ApiListResponse<T>` (모든 필드 required)
- **에러**: `ApiResponseError` (status / errorCode / errorMessage / errorHandleMethod)

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
