import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { mockOkItem, mockOkList } from "_utilities/mock-response";

import { fixedMockStore } from "./mock";
import type {
  FixedCreateRequest,
  FixedDetailItemType,
  FixedListItemType,
  FixedSearchRequestType,
  FixedUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const wrap = <T>(data: T) => ({ body: data });

export function GetFixedSearchApi(params: FixedSearchRequestType) {
  if (USE_MOCK) {
    const items = fixedMockStore.list();
    const filtered = items.filter((i) => {
      if (
        params.searchTerm &&
        !i.name.toLowerCase().includes(params.searchTerm.toLowerCase())
      )
        return false;
      if (params.isArchived !== undefined && i.isArchived !== params.isArchived)
        return false;
      return true;
    });
    return Promise.resolve(wrap(mockOkList(filtered)));
  }
  const queryString = objectToParams({ ...params }).toString();
  return apiFetch<ApiListResponse<FixedListItemType>>(
    `/api/front/v1/fixed/list?${queryString}`,
    { method: "GET" },
  );
}

export function GetFixedDetailApi(fixedId: string) {
  if (USE_MOCK) {
    const item = fixedMockStore.detail(fixedId);
    if (!item) return Promise.reject(new Error("fixed not found"));
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<FixedDetailItemType>>(
    `/api/front/v1/fixed/detail/${fixedId}`,
    { method: "GET", errorHandleMethod: "reject" },
  );
}

export function PostFixedCreateApi(params: FixedCreateRequest) {
  if (USE_MOCK) {
    const item = fixedMockStore.create({
      householdId: params.householdId,
      name: params.name,
      amount: params.amount,
      dayOfMonth: params.dayOfMonth,
      categoryId: params.categoryId ?? null,
      color: params.color ?? null,
      icon: params.icon ?? null,
      sortOrder: params.sortOrder,
      isArchived: params.isArchived,
    });
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<FixedDetailItemType>>(
    `/api/front/v1/fixed/create`,
    { method: "POST", body: params, errorHandleMethod: "reject" },
  );
}

export function PutFixedUpdateApi(params: FixedUpdateRequest) {
  if (USE_MOCK) {
    const { fixedId, ...rest } = params;
    fixedMockStore.update(fixedId, {
      ...rest,
      categoryId: rest.categoryId ?? null,
      color: rest.color ?? null,
      icon: rest.icon ?? null,
    });
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/fixed/update/${params.fixedId}`,
    { method: "PUT", body: params, errorHandleMethod: "reject" },
  );
}

export function DeleteFixedDeleteApi(fixedId: string) {
  if (USE_MOCK) {
    fixedMockStore.remove(fixedId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/fixed/delete/${fixedId}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
}
