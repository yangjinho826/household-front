# household-front

Next.js 15 + React 19 + TypeScript strict + shadcn/ui + Tailwind 3 + 토스 디자인 시스템.

## 요구사항

- Node.js 20+
- pnpm 9+

## 시작

```bash
pnpm install
pnpm dev          # http://localhost:3000 → /ko/login 으로 redirect
```

## 스크립트

| 명령 | 동작 |
|---|---|
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 빌드 결과 실행 |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest 1회 |
| `pnpm test:watch` | Vitest watch |

## shadcn 컴포넌트 추가

```bash
pnpm dlx shadcn@latest add <컴포넌트명>
```

## 환경 변수

`.env.local` 에서 설정:

```
BACKEND_URL=http://localhost:9500          # 서버 사이드 rewrites 용
NEXT_PUBLIC_BACKEND_URL=http://localhost:9500   # 브라우저 노출 용
```

`BACKEND_URL` 미설정 시 `/api/*` rewrite 비활성. 클라이언트가 그대로 Next 서버에 요청.

## Pretendard 폰트 활성화 (선택)

토스 디자인 시스템은 Pretendard 폰트를 사용합니다. 셋업 시점에 폰트 파일을 포함하지 않아 시스템 폰트로 fallback 됩니다.

활성화하려면:

1. https://github.com/orioncactus/pretendard 에서 `PretendardVariable.woff2` 다운로드
2. `public/fonts/PretendardVariable.woff2` 에 저장
3. `src/app/[locale]/layout.tsx` 의 `localFont` 주석 해제
4. `<html className={pretendard.variable}>` 적용

## 디렉토리

```
src/
├── app/[locale]/
│   ├── (auth)/login           # 로그인 화면 (placeholder)
│   └── (portal)/dashboard     # 대시보드 (placeholder)
├── features/                  # 도메인별 모듈
├── components/
│   ├── ui/                    # shadcn 컴포넌트
│   └── providers/
├── lib/
│   ├── api/parse-response.ts  # API 응답 파싱
│   ├── auth/session.ts        # 세션 쿠키
│   ├── design-tokens.ts       # 토스 색상 토큰
│   └── query-keys.ts
├── i18n/                      # next-intl 설정
└── store/                     # Zustand
messages/                       # ko.json / en.json
_reference/                     # 퍼블리싱 자료 staging (빌드 무관)
```

## 룰

- `~/.claude/rules/personal-frontend/general.md` — 스택/구조/네이밍
- `~/.claude/rules/personal-frontend/design.md` — 토스 시각 시스템
