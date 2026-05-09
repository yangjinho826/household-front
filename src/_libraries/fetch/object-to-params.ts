/**
 * 객체를 URLSearchParams 로 변환합니다. undefined 값은 무시.
 */
export function objectToParams(obj: Record<string, unknown>): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "string") {
      searchParams.append(key, value);
    }

    if (typeof value === "number") {
      searchParams.append(key, value.toString());
    }

    if (typeof value === "boolean") {
      searchParams.append(key, value.toString());
    }

    if (Array.isArray(value)) {
      for (const v of value) {
        searchParams.append(key, String(v));
      }
    }
  });

  return searchParams;
}
