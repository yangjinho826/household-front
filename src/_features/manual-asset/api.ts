import { apiFetch } from "_libraries/fetch/api-fetch";
import type { ApiResponse } from "_libraries/fetch/response";

import type {
  ManualAssetCreateRequest,
  ManualAssetListItemType,
  ManualAssetUpdateRequest,
} from "./types";

// 백엔드는 `id`(PK). 프론트는 `manualAssetId`.
type BackendManualAsset = Omit<ManualAssetListItemType, "manualAssetId"> & {
  id: string;
};

function toListItem(b: BackendManualAsset): ManualAssetListItemType {
  const { id, ...rest } = b;
  return { ...rest, manualAssetId: id };
}

export async function GetManualAssetListApi() {
  const res = await apiFetch<ApiResponse<BackendManualAsset[]>>(
    `/api/manual-asset/list`,
    { method: "GET" },
  );
  return {
    ...res,
    body: { ...res.body, data: res.body.data.map(toListItem) },
  };
}

export async function PostManualAssetCreateApi(
  params: ManualAssetCreateRequest,
  idempotencyKey?: string,
) {
  const res = await apiFetch<ApiResponse<BackendManualAsset>>(
    `/api/manual-asset/create`,
    {
      method: "POST",
      body: params,
      idempotencyKey,
      errorHandleMethod: "reject",
    },
  );
  return { ...res, body: { ...res.body, data: toListItem(res.body.data) } };
}

export async function PutManualAssetUpdateApi(params: ManualAssetUpdateRequest) {
  const { manualAssetId, ...body } = params;
  const res = await apiFetch<ApiResponse<BackendManualAsset>>(
    `/api/manual-asset/${manualAssetId}`,
    { method: "PUT", body, errorHandleMethod: "reject" },
  );
  return { ...res, body: { ...res.body, data: toListItem(res.body.data) } };
}

export async function DeleteManualAssetApi(manualAssetId: string) {
  return apiFetch<ApiResponse<null>>(
    `/api/manual-asset/${manualAssetId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
