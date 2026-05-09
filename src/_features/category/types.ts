export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  isIncome?: boolean;
};

export type CategoryCreateRequest = Omit<Category, "id">;
export type CategoryUpdateRequest = Partial<Category> & { id: string };
