import FixedFormSection from "_sections/fixed/fixed-form-section";

export default function FixedDetailPage({
  params,
}: {
  params: { fixedId: string };
}) {
  return <FixedFormSection fixedId={params.fixedId} />;
}
