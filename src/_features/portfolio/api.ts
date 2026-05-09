import { apiFetch } from "_libraries/fetch/api-fetch";
import type {
  ApiListResponse,
  ApiResponse,
} from "_libraries/fetch/response";
import { newId } from "_utilities/fmt";
import { mockOkItem as okItem, mockOkList as okList } from "_utilities/mock-response";

import { INITIAL_PORTFOLIO } from "./mock";
import type {
  PortfolioCreateRequest,
  PortfolioItem,
  PortfolioUpdateRequest,
} from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const state = { portfolio: [...INITIAL_PORTFOLIO] };

export async function GetPortfolioListApi(): Promise<ApiListResponse<PortfolioItem>> {
  if (USE_MOCK) return okList(state.portfolio);
  const res = await apiFetch<ApiListResponse<PortfolioItem>>("/api/portfolio/list", {
    method: "GET",
  });
  return res.body;
}

export async function PostPortfolioCreateApi(
  body: PortfolioCreateRequest,
): Promise<ApiResponse<PortfolioItem>> {
  if (USE_MOCK) {
    const created: PortfolioItem = { ...body, id: newId() };
    state.portfolio.push(created);
    return okItem(created);
  }
  const res = await apiFetch<ApiResponse<PortfolioItem>>("/api/portfolio/create", {
    method: "POST",
    body,
    errorHandleMethod: "reject",
  });
  return res.body;
}

export async function PutPortfolioUpdateApi(
  body: PortfolioUpdateRequest,
): Promise<ApiResponse<PortfolioItem>> {
  if (USE_MOCK) {
    state.portfolio = state.portfolio.map((p) =>
      p.id === body.id ? { ...p, ...body } : p,
    );
    const updated = state.portfolio.find((p) => p.id === body.id);
    if (!updated) throw new Error("Portfolio item not found");
    return okItem(updated);
  }
  const res = await apiFetch<ApiResponse<PortfolioItem>>(
    `/api/portfolio/update/${body.id}`,
    { method: "PUT", body, errorHandleMethod: "reject" },
  );
  return res.body;
}

export async function DeletePortfolioApi(
  id: string,
): Promise<ApiResponse<{ id: string }>> {
  if (USE_MOCK) {
    state.portfolio = state.portfolio.filter((p) => p.id !== id);
    return okItem({ id });
  }
  const res = await apiFetch<ApiResponse<{ id: string }>>(
    `/api/portfolio/delete/${id}`,
    { method: "DELETE", errorHandleMethod: "reject" },
  );
  return res.body;
}
