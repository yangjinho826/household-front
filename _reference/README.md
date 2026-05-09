# _reference/

미리 만들어둔 퍼블리싱 화면 자료를 여기에 넣어두는 staging 디렉토리.

## 어떤 자료를 넣어도 OK

- `.tsx` / `.jsx` React 컴포넌트
- `.html` / `.css` 단일 파일 (Claude 단일 artifact 등)
- `.png` / `.jpg` 스크린샷
- Figma export
- 코드 스니펫 텍스트 파일

## 통합 흐름

1. 이 디렉토리에 자료 넣기
2. "이 자료 보고 통합해줘" 식으로 트리거
3. 화면 단위로 `src/app/[locale]/(auth)/*` 또는 `(portal)/*` 에 페이지 생성
4. 도메인 컴포넌트는 `src/features/<domain>/` 로 추출
5. shadcn `<Button>` `<Input>` 베이스 + 토스 디자인 토큰 (`~/.claude/rules/personal-frontend/design.md`) 으로 정규화

## 주의

- `_` prefix 라 Next.js 라우트로 노출되지 않음 (App Router 컨벤션)
- `tsconfig.json` `exclude` 에 들어가 있어 빌드 무관
- 통합 끝나면 디렉토리 삭제 또는 `.gitignore` 등록
