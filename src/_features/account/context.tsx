"use client";

import { createContext, ReactNode, useContext } from "react";

import { useAccount } from "./hooks/use-account";

type AccountContextType = ReturnType<typeof useAccount>;

const AccountContext = createContext<AccountContextType | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const value = useAccount();
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccountContext(): AccountContextType {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccountContext must be used within AccountProvider");
  return ctx;
}
