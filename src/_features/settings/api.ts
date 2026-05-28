import { apiFetch } from "_libraries/fetch/api-fetch";
import type { ApiResponse } from "_libraries/fetch/response";

import type { SettingsOverviewType } from "./types";

export async function GetSettingsOverviewApi() {
  return apiFetch<ApiResponse<SettingsOverviewType>>(`/api/settings/overview`, {
    method: "GET",
  });
}
