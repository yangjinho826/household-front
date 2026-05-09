import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type { ApiListResponse } from "_libraries/fetch/response";
import { mockOkList } from "_utilities/mock-response";

import { accountSnapshotMockStore } from "./mock";
import type {
  AccountSnapshotItemType,
  AccountSnapshotSearchRequestType,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const wrap = <T>(data: T) => ({ body: data });

export function GetAccountSnapshotSearchApi(
  params: AccountSnapshotSearchRequestType,
) {
  if (USE_MOCK) {
    const items = accountSnapshotMockStore.list({
      accountId: params.accountId,
    });
    return Promise.resolve(wrap(mockOkList(items)));
  }
  const queryString = objectToParams({ ...params }).toString();
  return apiFetch<ApiListResponse<AccountSnapshotItemType>>(
    `/api/front/v1/account-snapshot/list?${queryString}`,
    { method: "GET" },
  );
}
