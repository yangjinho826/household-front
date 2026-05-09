import { FixedReference } from "_features/fixed/components/fixed-reference";
import { CalendarView } from "_features/transaction/components/calendar-view";
import { TransactionFab } from "_features/transaction/components/transaction-fab";
import { TransactionList } from "_features/transaction/components/transaction-list";
import { TransactionsHeader } from "_features/transaction/components/transactions-header";

export function TransactionsSection() {
  return (
    <div className="fade-in">
      <TransactionsHeader />
      <TransactionList />
      <FixedReference />
      <CalendarView />
      <TransactionFab />
    </div>
  );
}
