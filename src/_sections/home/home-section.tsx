import { TotalAssetsCard } from "_features/account/components/total-assets-card";
import { HouseholdHeader } from "_features/household/components/household-header";
import { CategorySpendList } from "_features/transaction/components/category-spend-list";
import { IncomeExpenseSummary } from "_features/transaction/components/income-expense-summary";
import { RecentTransactions } from "_features/transaction/components/recent-transactions";

export function HomeSection() {
  return (
    <div className="fade-in">
      <HouseholdHeader />
      <TotalAssetsCard />
      <IncomeExpenseSummary />
      <CategorySpendList />
      <RecentTransactions />
    </div>
  );
}
