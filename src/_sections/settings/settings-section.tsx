"use client";

import { useHouseholdContext } from "_features/household/context";
import { BudgetStatsGrid } from "_features/household/components/budget-stats-grid";
import { HouseholdCard } from "_features/household/components/household-card";
import { ProfileCard } from "_features/household/components/profile-card";
import { SettingsAccount } from "_features/household/components/settings-account";
import { SampleSettingsLink } from "_features/sample/components/sample-settings-link";
import { SettingsHeader } from "_features/household/components/settings-header";
import { SettingsManagement } from "_features/household/components/settings-management";
import { SettingsSecurity } from "_features/household/components/settings-security";

export function SettingsSection() {
  const { user } = useHouseholdContext();
  if (!user) return null;

  return (
    <div className="fade-in">
      <SettingsHeader />
      <ProfileCard />
      <HouseholdCard />
      <BudgetStatsGrid />
      <SettingsManagement />
      <SampleSettingsLink />
      <SettingsSecurity />
      <SettingsAccount />
    </div>
  );
}
