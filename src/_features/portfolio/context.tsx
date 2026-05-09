"use client";

import { createContext, ReactNode, useContext } from "react";

import { usePortfolio } from "./hooks/use-portfolio";

type PortfolioContextType = ReturnType<typeof usePortfolio>;

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const value = usePortfolio();
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolioContext(): PortfolioContextType {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolioContext must be used within PortfolioProvider");
  return ctx;
}
