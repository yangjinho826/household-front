import type { Sample } from "./types";

export const INITIAL_SAMPLES: Sample[] = [
  {
    id: "s1",
    title: "샘플 표준 모듈",
    description: "bims sample 패턴을 그대로 따라간 학습용 모듈",
    createdAt: "2026-05-01",
  },
  {
    id: "s2",
    title: "도메인별 책임 분리",
    description: "api / types / store / context / hooks / queries / components",
    createdAt: "2026-05-03",
  },
  {
    id: "s3",
    title: "TanStack Query + Zustand",
    description: "서버 상태는 Query, UI 상태는 Zustand. 절대 섞지 말 것",
    createdAt: "2026-05-05",
  },
  {
    id: "s4",
    title: "mock 토글 패턴",
    description: "NEXT_PUBLIC_USE_MOCK 환경변수로 mock ↔ 실제 백엔드 전환",
    createdAt: "2026-05-07",
  },
  {
    id: "s5",
    title: "useSample ReturnType 자동 매핑",
    description: "context.tsx 가 useSample 훅의 ReturnType 으로 자동 타입화",
    createdAt: "2026-05-09",
  },
];
