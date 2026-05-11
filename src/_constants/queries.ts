import { mergeQueryKeys } from "@lukemorales/query-key-factory";

import { accountSnapshots } from "_features/account-snapshot/queries/query-key";
import { accounts } from "_features/account/queries/query-key";
import { auth } from "_features/auth/queries/query-key";
import { categories } from "_features/category/queries/query-key";
import { fixedExpenses } from "_features/fixed/queries/query-key";
import { households } from "_features/household/queries/query-key";
import { portfolios } from "_features/portfolio/queries/query-key";
import { samples } from "_features/sample/queries/query-key";
import { stats } from "_features/stats/queries/query-key";
import { transactions } from "_features/transaction/queries/query-key";

export const queryKeys = mergeQueryKeys(
  samples,
  auth,
  accounts,
  categories,
  fixedExpenses,
  portfolios,
  transactions,
  households,
  accountSnapshots,
  stats,
);
