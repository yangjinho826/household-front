export type FixedExpense = {
  id: string;
  name: string;
  amount: number;
  day: number;
};

export type FixedCreateRequest = Omit<FixedExpense, "id">;
export type FixedUpdateRequest = Partial<FixedExpense> & { id: string };
