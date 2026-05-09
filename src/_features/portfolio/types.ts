export type PortfolioItem = {
  id: string;
  name: string;
  broker: string;
  quantity: number;
  currentValue: number;
  avgPrice: number;
};

export type PortfolioCreateRequest = Omit<PortfolioItem, "id">;
export type PortfolioUpdateRequest = Partial<PortfolioItem> & { id: string };
