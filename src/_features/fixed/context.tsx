"use client";

import { createContext, ReactNode, useContext } from "react";

import { useFixed } from "./hooks/use-fixed";

type FixedContextType = ReturnType<typeof useFixed>;

const FixedContext = createContext<FixedContextType | null>(null);

export function FixedProvider({ children }: { children: ReactNode }) {
  const value = useFixed();
  return <FixedContext.Provider value={value}>{children}</FixedContext.Provider>;
}

export function useFixedContext(): FixedContextType {
  const ctx = useContext(FixedContext);
  if (!ctx) throw new Error("useFixedContext must be used within FixedProvider");
  return ctx;
}
