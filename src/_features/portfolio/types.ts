export interface PortfolioSearchRequestType {
  searchTerm?: string;
  isArchived?: boolean;
}

export interface PortfolioBaseRequestType {
  householdId: string;
  accountId: string;
  ticker: string;
  symbol?: string | null;
  quantity: number;
  avgPrice: number;
  currentValue: number;
  isArchived: boolean;
}

export type PortfolioCreateRequest = PortfolioBaseRequestType;

export interface PortfolioUpdateRequest extends PortfolioBaseRequestType {
  portfolioId: string;
}

export interface PortfolioListItemType {
  rowNo: number;
  portfolioId: string;
  householdId: string;
  accountId: string;
  ticker: string;
  symbol: string | null;
  quantity: number;
  avgPrice: number;
  currentValue: number;
  isArchived: boolean;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}

export interface PortfolioDetailItemType {
  portfolioId: string;
  householdId: string;
  accountId: string;
  ticker: string;
  symbol: string | null;
  quantity: number;
  avgPrice: number;
  currentValue: number;
  isArchived: boolean;
  frstRegDt: string;
  lastMdfcnDt: string;
  dataStatCd: string;
}
