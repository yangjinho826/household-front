import HouseholdFormSection from "_sections/household/household-form-section";

export default function HouseholdDetailPage({
  params,
}: {
  params: { householdId: string };
}) {
  return <HouseholdFormSection householdId={params.householdId} />;
}
