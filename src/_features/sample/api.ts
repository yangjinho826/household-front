import { apiFetch } from "_libraries/fetch/api-fetch";
import { objectToParams } from "_libraries/fetch/object-to-params";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { mockOkItem, mockOkList } from "_utilities/mock-response";

import { sampleMockStore } from "./mock";
import type {
  SampleCreateRequest,
  SampleDetailItemType,
  SampleListItemType,
  SampleSearchRequestType,
  SampleUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const wrap = <T>(data: T) => ({ body: data });

const toIsoDate = (d: Date | null | undefined): string =>
  d ? new Date(d).toISOString().slice(0, 10) : "";

// 샘플 검색
export function GetSampleSearchApi(params: SampleSearchRequestType) {
  if (USE_MOCK) {
    const items = sampleMockStore.list();
    const filtered = items.filter((i) => {
      if (
        params.searchTerm &&
        !`${i.sampleTitle} ${i.sampleContent}`
          .toLowerCase()
          .includes(params.searchTerm.toLowerCase())
      )
        return false;
      if (
        params.sampleEmail &&
        !i.sampleEmail.toLowerCase().includes(params.sampleEmail.toLowerCase())
      )
        return false;
      return true;
    });
    return Promise.resolve(wrap(mockOkList(filtered)));
  }
  const queryString = objectToParams({ ...params }).toString();
  return apiFetch<ApiListResponse<SampleListItemType>>(
    `/api/front/v1/sample/list?${queryString}`,
    { method: "GET" },
  );
}

// 샘플 생성
export function PostSampleCreateApi(params: SampleCreateRequest) {
  if (USE_MOCK) {
    const { sampleFile: _omit, ...rest } = params;
    void _omit;
    const item = sampleMockStore.create({
      ...rest,
      sampleSelect: rest.sampleSelect ?? "",
      sampleDate: toIsoDate(rest.sampleDate),
    });
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<SampleDetailItemType>>(
    `/api/front/v1/sample/create`,
    {
      method: "POST",
      body: params,
      errorHandleMethod: "reject",
    },
  );
}

// 샘플 상세
export function GetSampleDetailApi(sampleId: string) {
  if (USE_MOCK) {
    const item = sampleMockStore.detail(sampleId);
    if (!item) return Promise.reject(new Error("sample not found"));
    return Promise.resolve(wrap(mockOkItem(item)));
  }
  return apiFetch<ApiResponse<SampleDetailItemType>>(
    `/api/front/v1/sample/detail/${sampleId}`,
    { method: "GET", errorHandleMethod: "reject" },
  );
}

// 샘플 수정
export function PutSampleUpdateApi(params: SampleUpdateRequest) {
  if (USE_MOCK) {
    const { sampleFile: _omit, sampleId, ...rest } = params;
    void _omit;
    sampleMockStore.update(sampleId, {
      ...rest,
      sampleSelect: rest.sampleSelect ?? "",
      sampleDate: toIsoDate(rest.sampleDate),
    });
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/sample/update/${params.sampleId}`,
    {
      method: "PUT",
      body: params,
      errorHandleMethod: "reject",
    },
  );
}

// 샘플 삭제
export function DeleteSampleDeleteApi(sampleId: string) {
  if (USE_MOCK) {
    sampleMockStore.remove(sampleId);
    return Promise.resolve(wrap(mockOkItem(undefined as unknown as void)));
  }
  return apiFetch<ApiResponse<void>>(
    `/api/front/v1/sample/delete/${sampleId}`,
    { method: "DELETE" },
  );
}
