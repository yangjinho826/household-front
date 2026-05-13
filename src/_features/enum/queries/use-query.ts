import { useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "_constants/queries";

import type { EnumName } from "../types";

/**
 * enum 값 목록 — 정적 데이터라 무한 캐시.
 *
 * 새 enum 값 추가는 백엔드 enum 클래스 + ko.json/en.json 라벨만 손대면 됨.
 */
export const useEnumOptions = (name: EnumName) => {
  return useSuspenseQuery({
    ...queryKeys.enum.options(name),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
