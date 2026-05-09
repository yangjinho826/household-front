"use client";

import { createContext, ReactNode, useContext } from "react";

import { useSample } from "./hooks/use-sample";

type SampleContextType = ReturnType<typeof useSample>;

const SampleContext = createContext<SampleContextType | null>(null);

export function SampleProvider({ children }: { children: ReactNode }) {
  const value = useSample();
  return <SampleContext.Provider value={value}>{children}</SampleContext.Provider>;
}

export function useSampleContext(): SampleContextType {
  const ctx = useContext(SampleContext);
  if (!ctx) {
    throw new Error("useSampleContext must be used within SampleProvider");
  }
  return ctx;
}
