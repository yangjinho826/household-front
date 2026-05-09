import { AccountList } from "_features/account/components/account-list";
import { AssetDistribution } from "_features/account/components/asset-distribution";
import { WealthHeader } from "_features/account/components/wealth-header";
import { WealthSummaryCard } from "_features/account/components/wealth-summary-card";

export function WealthSection() {
  return (
    <div className="fade-in">
      <WealthHeader />
      <WealthSummaryCard />
      <AssetDistribution />
      <AccountList />
    </div>
  );
}
