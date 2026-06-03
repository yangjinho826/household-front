import { Center, Loader } from "@mantine/core";

/**
 * Suspense fallback 전용 로더 — 콘텐츠 영역 세로 중앙에 스피너.
 *
 * 기존 `<Center py="xl">` 는 높이가 없어 콘텐츠 상단에 붙었음.
 * `mih`(min-height)로 뷰포트 기준 높이를 확보해 화면 중앙에 오게 한다.
 */
export function PageLoader() {
  return (
    <Center mih="70dvh">
      <Loader />
    </Center>
  );
}
