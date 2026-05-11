import { apiFetch } from "_libraries/fetch/api-fetch";
import type { ApiResponse } from "_libraries/fetch/response";

import type {
  CategoryStatsItemType,
  MonthlyStatsRequest,
  MonthlyStatsType,
} from "./types";

const num = (v: number | string) => (typeof v === "number" ? v : Number(v));

interface BackendCategoryStatsItem {
  category_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  is_income: boolean;
  amount: number | string;
  ratio: number | string;
}

interface BackendMonthlyStatsResponse {
  year: number;
  month: number;
  monthly_income: number | string;
  monthly_expense: number | string;
  monthly_transfer: number | string;
  by_category: BackendCategoryStatsItem[];
}

function mapCategoryItem(b: BackendCategoryStatsItem): CategoryStatsItemType {
  return {
    categoryId: b.category_id,
    name: b.name,
    icon: b.icon,
    color: b.color,
    isIncome: b.is_income,
    amount: num(b.amount),
    ratio: num(b.ratio),
  };
}

export async function GetMonthlyStatsApi(params: MonthlyStatsRequest) {
  const res = await apiFetch<ApiResponse<BackendMonthlyStatsResponse>>(
    `/api/stats/monthly?year=${params.year}&month=${params.month}`,
    { method: "GET" },
  );
  const b = res.body.data;
  const data: MonthlyStatsType = {
    year: b.year,
    month: b.month,
    monthlyIncome: num(b.monthly_income),
    monthlyExpense: num(b.monthly_expense),
    monthlyTransfer: num(b.monthly_transfer),
    byCategory: b.by_category.map(mapCategoryItem),
  };
  return { ...res, body: { ...res.body, data } };
}
