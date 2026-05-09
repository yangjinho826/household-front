"use client";

import { createContext, ReactNode, useContext } from "react";

import { useCategory } from "./hooks/use-category";

type CategoryContextType = ReturnType<typeof useCategory>;

const CategoryContext = createContext<CategoryContextType | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const value = useCategory();
  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategoryContext(): CategoryContextType {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategoryContext must be used within CategoryProvider");
  return ctx;
}
