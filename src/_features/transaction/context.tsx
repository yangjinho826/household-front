"use client";

import { createContext, ReactNode, useContext } from "react";

import { useTransaction } from "./hooks/use-transaction";

type TransactionContextType = ReturnType<typeof useTransaction>;

const TransactionContext = createContext<TransactionContextType | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const value = useTransaction();
  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

export function useTransactionContext(): TransactionContextType {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactionContext must be used within TransactionProvider");
  return ctx;
}
