import MembersSection from "_sections/members/members-section";

export default function MembersPage({
  params,
}: {
  params: { householdId: string };
}) {
  return <MembersSection householdId={params.householdId} />;
}
