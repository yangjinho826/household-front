export type AccountType = "생활" | "적립" | "투자";

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  startBalance: number;
  color: string;
  icon: string;
};

export type AccountCreateRequest = Omit<Account, "id">;
export type AccountUpdateRequest = Partial<Account> & { id: string };
