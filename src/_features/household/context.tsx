"use client";

import { createContext, ReactNode, useContext } from "react";

import { useHousehold } from "./hooks/use-household";

type HouseholdContextType = ReturnType<typeof useHousehold>;

const HouseholdContext = createContext<HouseholdContextType | null>(null);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const value = useHousehold();
  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}

export function useHouseholdContext(): HouseholdContextType {
  const ctx = useContext(HouseholdContext);
  if (!ctx) throw new Error("useHouseholdContext must be used within HouseholdProvider");
  return ctx;
}
