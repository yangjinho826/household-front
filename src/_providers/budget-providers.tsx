"use client";

import type { ReactNode } from "react";

import { AccountProvider } from "_features/account/context";
import { CategoryProvider } from "_features/category/context";
import { FixedProvider } from "_features/fixed/context";
import { HouseholdProvider } from "_features/household/context";
import { PortfolioProvider } from "_features/portfolio/context";
import { TransactionProvider } from "_features/transaction/context";

/**
 * BudgetProviders — 가계부 도메인 6개 Provider 묶음.
 *
 * `(user)/layout.tsx` 가 한 번에 마운트.
 * 각 도메인 Provider 는 useXxx 훅의 ReturnType 으로 자동 매핑되어 있어
 * 컴포넌트는 useXxxContext() 로 소비.
 */
export function BudgetProviders({ children }: { children: ReactNode }) {
  return (
    <HouseholdProvider>
      <AccountProvider>
        <TransactionProvider>
          <PortfolioProvider>
            <CategoryProvider>
              <FixedProvider>{children}</FixedProvider>
            </CategoryProvider>
          </PortfolioProvider>
        </TransactionProvider>
      </AccountProvider>
    </HouseholdProvider>
  );
}
